const pool = require('../config/database');
const Configuracion = require('../models/configuracion');
const Servicios = require('../models/servicios');
const Especialidades = require('../models/especialidades');
const Nosotros = require('../models/nosotros');
const Precios = require('../models/precios');

const OLLAMA_URL = (process.env.OLLAMA_URL || 'http://127.0.0.1:11434').replace(/\/+$/, '');
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma3';
const OLLAMA_TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS || 25000); // 25s timeout
const MAX_PROMPT_LENGTH = 3000;
const CACHE_TTL_MS = 30000; // 30 segundos de caché para datos de la BD

// Caché en memoria de datos de la base de datos para el chatbot
let cachedDbData = null;
let lastCacheUpdate = 0;

/**
 * Obtiene los datos actualizados de la base de datos MySQL (con caché de 30s)
 */
async function getLiveDXNData() {
  const now = Date.now();
  if (cachedDbData && (now - lastCacheUpdate) < CACHE_TTL_MS) {
    return cachedDbData;
  }

  try {
    const [configRes, servicios, especialidades, nosotros, precios] = await Promise.all([
      Configuracion.getAll().catch(() => ({ map: {} })),
      Servicios.getAll().catch(() => []),
      Especialidades.getAll().catch(() => []),
      Nosotros.getAll().catch(() => []),
      Precios.getAll().catch(() => []),
    ]);

    cachedDbData = {
      config: configRes.map || {},
      servicios: Array.isArray(servicios) ? servicios : [],
      especialidades: Array.isArray(especialidades) ? especialidades : [],
      nosotros: Array.isArray(nosotros) ? nosotros : [],
      precios: Array.isArray(precios) ? precios : [],
    };
    lastCacheUpdate = now;
    return cachedDbData;
  } catch (error) {
    console.warn('[Chatbot] Error consultando BD para contexto:', error.message);
    if (cachedDbData) return cachedDbData;

    return {
      config: {
        sitio_nombre: 'DXN CoffeeHouse',
        direccion: 'Av. Heroínas #456 entre San Martín y 25 de Mayo, Cochabamba, Bolivia',
        horario: 'Lunes a Sábado: 07:30 - 21:30 | Domingos: 09:00 - 20:00',
        telefono: '+591 4 456-7890',
        whatsapp: '+591 71234567',
        email: 'contacto@dxncoffeehouse.bo',
      },
      servicios: [],
      especialidades: [],
      nosotros: [],
      precios: [],
    };
  }
}

/**
 * Construye un System Prompt optimizado, conciso y de alta densidad de información
 * para que Gemma 3 evalúe los tokens en pocos segundos en CPU y no sufra retardos.
 */
function buildSystemPrompt(data) {
  const { config, servicios, especialidades, precios, nosotros } = data;

  const serviciosList = servicios.map(s => s.titulo).join(', ')
    || 'Barismo Gourmet, Venta y Distribución DXN, Catas guiadas, Asesoría Nutricional, Coworking WiFi, Membresías';

  const menuList = especialidades.map(p => {
    const caja = p.precio_caja ? ` / ${p.precio_caja} Bs caja` : '';
    const benef = p.beneficios ? ` (${p.beneficios})` : '';
    return `${p.nombre} [${p.categoria}]: ${p.precio} Bs taza${caja}${benef}`;
  }).join('; ')
    || 'Café Lingzhi 2 en 1 Negro (15 Bs taza / 140 Bs caja), Lingzhi 3 en 1 con crema vegetal (18 Bs taza / 155 Bs caja), Zhi Mocha con cacao (22 Bs taza / 175 Bs caja), Cocozhi chocolate (20 Bs taza / 160 Bs caja), Spica Tea (14 Bs taza / 130 Bs caja), Cordyceps Coffee (24 Bs taza / 190 Bs caja)';

  const preciosList = precios.map(pr => `${pr.titulo} (${pr.precio} Bs ${pr.periodo})`).join(', ')
    || 'Taza Barista (15 Bs), Combo Degustación (35 Bs), Pack Familiar (180 Bs), Membresía DXN Vitalicia (250 Bs con 40% descuento)';

  const historiaResumen = nosotros.map(n => `${n.titulo}: ${n.contenido.slice(0, 140)}...`).join(' | ');

  return `Eres el Barista Virtual y Asesor de Salud de "${config.sitio_nombre || 'DXN CoffeeHouse'}" en Cochabamba, Bolivia (Ubicación: ${config.direccion || 'Av. Heroínas #456'}, Horarios: ${config.horario || 'Lunes a Sábado 07:30-21:30, Dom 09:00-20:00'}, WhatsApp: ${config.whatsapp || '+591 71234567'}).
Vendes café gourmet con extracto de Ganoderma Lucidum (Hongo Lingzhi).
Salud: Es un café alcalino que NO produce gastritis, acidez ni reflujo; muy bajo en cafeína natural (0.06%), NO produce taquicardia ni insomnio; rico en 150+ antioxidantes.
Servicios: ${serviciosList}.
Menú Oficial: ${menuList}.
Precios y Combos: ${preciosList}.
Membresía DXN: 250 Bs pago único (código internacional + hasta 40% descuento de por vida).
Sobre nosotros: ${historiaResumen || 'Cafetería gourmet y saludable pionera en Cochabamba fusionando bienestar y café premium'}.
Reglas de respuesta:
- Responde siempre en español, con calidez de barista amable y profesional.
- Sé conciso: responde en 1 a 2 párrafos claros (máximo 120 palabras).
- Basa tus respuestas en los precios y productos del menú oficial arriba.`;
}

/**
 * Normaliza texto para comparaciones flexibles (elimina tildes y mayúsculas)
 */
function normalizeText(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Motor de Fallback Inteligente Basado en MySQL
 * Garantiza respuestas precisas, ricas y con formato si Ollama está ocupado o apagado.
 */
function smartFallback(question, dbData) {
  const q = normalizeText(question);
  const { config, servicios, especialidades, nosotros, precios } = dbData;

  // 1. Servicios
  if (q.includes('servicio') || q.includes('ofrecen') || q.includes('hacen') || q.includes('wifi') || q.includes('coworking') || q.includes('cata') || q.includes('degustacion') || q.includes('asesoria') || q.includes('distribucion')) {
    if (servicios && servicios.length > 0) {
      const lista = servicios.map(s => `• **${s.titulo}**: ${s.descripcion}`).join('\n');
      return `¡En **DXN CoffeeHouse** te ofrecemos una experiencia completa!\n\n${lista}\n\n¿Te gustaría más información sobre algún servicio en particular?`;
    }
    return 'En DXN CoffeeHouse ofrecemos barismo gourmet saludable, venta mayorista/minorista DXN, degustaciones guiadas, asesoría nutricional, espacio coworking con WiFi y afiliaciones con descuentos vitalicios.';
  }

  // 2. Producto específico
  const productoEncontrado = especialidades.find(p => {
    const nom = normalizeText(p.nombre);
    return q.includes(nom)
      || (nom.includes('2 en 1') && (q.includes('2 en 1') || q.includes('negro') || q.includes('black')))
      || (nom.includes('3 en 1') && q.includes('3 en 1'))
      || (nom.includes('mocha') && q.includes('mocha'))
      || (nom.includes('cocozhi') && (q.includes('cocozhi') || q.includes('chocolate')))
      || (nom.includes('spica') && (q.includes('spica') || q.includes('te')))
      || (nom.includes('cordyceps') && q.includes('cordyceps'));
  });

  if (productoEncontrado) {
    const precioCaja = productoEncontrado.precio_caja ? ` y la caja para preparar en casa a ${productoEncontrado.precio_caja} Bs` : '';
    const benef = productoEncontrado.beneficios ? `\n\n🌿 **Beneficios:** ${productoEncontrado.beneficios}` : '';
    return `☕ **${productoEncontrado.nombre}** (${productoEncontrado.categoria}):\n${productoEncontrado.descripcion}\n\n💰 **Precio:** ${productoEncontrado.precio} Bs la taza en barra${precioCaja}.${benef}\n\n¿Te gustaría probarlo o pedirlo para entrega?`;
  }

  // 3. Menú general
  if (q.includes('menu') || q.includes('carta') || q.includes('especialidad') || q.includes('bebida') || q.includes('cafe')) {
    if (especialidades && especialidades.length > 0) {
      const resumen = especialidades.map(p => `• **${p.nombre}**: ${p.precio} Bs taza (Caja: ${p.precio_caja || 'N/A'} Bs)`).join('\n');
      return `¡Este es nuestro menú de cafés saludables con Ganoderma!\n\n${resumen}\n\nTodas nuestras bebidas son alcalinas y cuidan tu estómago. ¿Cuál te llama la atención?`;
    }
  }

  // 4. Precios, combos, membresía
  if (q.includes('precio') || q.includes('costo') || q.includes('cuesta') || q.includes('cuanto') || q.includes('combo') || q.includes('pack') || q.includes('membresia') || q.includes('afilia') || q.includes('socio') || q.includes('descuento')) {
    if (q.includes('membresia') || q.includes('afilia') || q.includes('socio') || q.includes('descuento')) {
      const planMembresia = precios.find(pr => normalizeText(pr.titulo).includes('membresia') || normalizeText(pr.categoria).includes('membresia'));
      if (planMembresia) {
        return `🌟 **${planMembresia.titulo}** (Inversión única: ${planMembresia.precio} Bs):\n${planMembresia.descripcion || 'Afíliate como socio oficial DXN.'}\n\nIncluye código internacional con hasta 40% de descuento vitalicio en toda la gama de productos de salud y kit de bienvenida.`;
      }
      return 'Con la **Membresía Oficial DXN** (pago único de 250 Bs) obtienes tu código internacional de socio distribuidor, un kit de bienvenida y descuentos de por vida de hasta 40% en toda la línea.';
    }

    if (precios && precios.length > 0) {
      const listado = precios.map(pr => `• **${pr.titulo}**: ${pr.precio} Bs (${pr.periodo}) - ${pr.descripcion || ''}`).join('\n');
      return `💰 **Planes y Precios DXN CoffeeHouse:**\n\n${listado}\n\n¿Te interesa ordenar un combo o adquirir tu membresía?`;
    }
  }

  // 5. Ubicación, horarios, contacto
  if (q.includes('ubicacion') || q.includes('donde') || q.includes('direccion') || q.includes('horario') || q.includes('hora') || q.includes('abren') || q.includes('cierran') || q.includes('domingo') || q.includes('telefono') || q.includes('whatsapp') || q.includes('contacto')) {
    const dir = config.direccion || 'Av. Heroínas #456 entre San Martín y 25 de Mayo, Cochabamba, Bolivia';
    const hor = config.horario || 'Lunes a Sábado: 07:30 - 21:30 | Domingos: 09:00 - 20:00';
    const cel = config.whatsapp || '+591 71234567';
    const tel = config.telefono || '+591 4 456-7890';
    return `📍 **Ubicación & Horarios de DXN CoffeeHouse:**\n\n• **Dirección:** ${dir}\n• **Horarios:** ${hor}\n• **WhatsApp para pedidos:** ${cel}\n• **Teléfono fijo:** ${tel}\n\n¡Te esperamos en Cochabamba para una deliciosa taza saludable!`;
  }

  // 6. Nosotros, historia, misión
  if (q.includes('nosotros') || q.includes('historia') || q.includes('mision') || q.includes('vision') || q.includes('tienda') || q.includes('quienes') || q.includes('origen')) {
    const historiaItem = nosotros.find(n => normalizeText(n.seccion).includes('historia') || normalizeText(n.titulo).includes('historia'));
    if (historiaItem) {
      return `📜 **${historiaItem.titulo}:**\n\n${historiaItem.contenido}\n\nNuestra misión es transformar el hábito del café en una experiencia de nutrición y bienestar preventivo.`;
    }
    return 'DXN CoffeeHouse nació con la pasión de fusionar el aroma del café gourmet de alta calidad con los comprobados beneficios milenarios del hongo Ganoderma Lucidum en Cochabamba.';
  }

  // 7. Salud, Ganoderma, Gastritis, Diabetes, Presión, Energía
  if (q.includes('ganoderma') || q.includes('lingzhi') || q.includes('hongo') || q.includes('salud') || q.includes('beneficio') || q.includes('gastritis') || q.includes('acidez') || q.includes('diabetes') || q.includes('presion') || q.includes('taquicardia') || q.includes('cafeina') || q.includes('insomnio') || q.includes('antioxidante')) {
    return '🍄 **El Secreto Saludable de DXN CoffeeHouse: Ganoderma Lucidum (Lingzhi)**\n\n• **No causa gastritis ni acidez:** Es un café alcalino que neutraliza los ácidos estomacales.\n• **Cero taquicardia o nerviosismo:** Muy bajo en cafeína natural (0.06%), brindando energía limpia y sostenida.\n• **Rico en nutrientes:** Contiene más de 400 compuestos bioactivos y 150 antioxidantes.\n• **Refuerzo general:** Desintoxica el organismo, vigoriza el sistema inmunitario y ayuda a equilibrar la presión y glucosa.\n\nPara gastritis o desintoxicación te recomendamos el **Café Lingzhi 2 en 1 Negro** (15 Bs taza / 140 Bs caja). ¿Te gustaría saber más?';
  }

  // 8. Sobre la Página Web
  if (q.includes('pagina') || q.includes('sistema') || q.includes('web') || q.includes('seccion') || q.includes('video')) {
    return 'Nuestra plataforma web cuenta con:\n1. **Inicio:** Video de cafetería en alta definición (vía Pexels).\n2. **Servicios:** 6 servicios oficiales sincronizados desde MySQL.\n3. **Especialidades:** Catálogo de cafés con filtros por categoría.\n4. **Nosotros:** Historia, fotos del local y ciencia del Ganoderma.\n5. **Precios:** Combos, planes y membresía DXN.\n6. **Contactos:** Formulario interactivo que guarda consultas en MySQL.\n7. **Barista IA:** Asistente con Ollama y Gemma 3.\n\n¿Qué sección deseas explorar?';
  }

  // Saludo general
  return `¡Hola! Bienvenido a **${config.sitio_nombre || 'DXN CoffeeHouse'}**. Soy tu Barista Virtual y Asesor Nutricional.\n\nPreparamos café gourmet con Ganoderma Lucidum que no produce acidez ni taquicardia. Puedes preguntarme sobre:\n☕ **Menú de cafés y precios**\n🍄 **Beneficios para la salud y gastritis**\n💼 **Espacio coworking y servicios**\n📍 **Ubicación y horarios en Cochabamba**\n\n¿En qué te puedo colaborar hoy?`;
}

/**
 * Endpoint POST /api/chatbot (y /ollama-prompt)
 */
async function prompt(req, res) {
  const question = req.body.prompt || req.body.message || req.body.pregunta;
  const history = Array.isArray(req.body.history) ? req.body.history : [];

  if (!question || typeof question !== 'string' || !question.trim() || question.length > MAX_PROMPT_LENGTH) {
    return res.status(400).json({ error: `El prompt debe ser un texto de hasta ${MAX_PROMPT_LENGTH} caracteres` });
  }

  const cleanQuestion = question.trim();

  // 1. Cargar datos vivos desde MySQL
  const dbData = await getLiveDXNData();
  const systemPrompt = buildSystemPrompt(dbData);

  // 2. Intentar responder con Ollama (Gemma 3) usando /api/chat
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

  try {
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    if (history.length > 0) {
      const recentHistory = history.slice(-4).map(m => ({
        role: m.sender === 'user' || m.role === 'user' ? 'user' : 'assistant',
        content: String(m.text || m.content || '').slice(0, 300)
      })).filter(m => m.content.trim().length > 0);
      messages.push(...recentHistory);
    }

    messages.push({ role: 'user', content: cleanQuestion });

    const ollamaResponse = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        options: {
          num_predict: 140, // Longitud concisa para respuesta en 8-12s
          temperature: 0.35,
          top_p: 0.9,
        },
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (ollamaResponse.ok) {
      const data = await ollamaResponse.json();
      const botReply = data?.message?.content || data?.response;
      if (typeof botReply === 'string' && botReply.trim().length > 0) {
        return res.json({
          response: botReply.trim(),
          source: 'ollama_gemma3',
          model: OLLAMA_MODEL
        });
      }
    }

    // Si Ollama respondió con error de estado
    console.warn(`[Chatbot] Ollama /api/chat devolvió estado ${ollamaResponse.status}. Activando Barista DXN con datos MySQL.`);
    const fallbackText = smartFallback(cleanQuestion, dbData);
    return res.json({
      response: fallbackText,
      source: 'dxn_advisor_smart_db',
      note: 'Respuesta generada con base en los datos oficiales de MySQL.'
    });

  } catch (error) {
    clearTimeout(timeout);
    console.warn(`[Chatbot] Conexión a Ollama diferida o excedió tiempo (${error.message}). Usando Barista DXN con datos MySQL.`);
    const fallbackText = smartFallback(cleanQuestion, dbData);
    return res.json({
      response: fallbackText,
      source: 'dxn_advisor_smart_db',
      note: 'Respuesta del Asistente Barista desde MySQL.'
    });
  }
}

/**
 * Endpoint GET /api/chatbot/status para verificar estado de Ollama y de la BD
 */
async function status(req, res) {
  let ollamaOk = false;
  let ollamaModels = [];
  try {
    const r = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(3000) });
    if (r.ok) {
      const d = await r.json();
      ollamaOk = true;
      ollamaModels = (d.models || []).map(m => m.name);
    }
  } catch (_) {
    ollamaOk = false;
  }

  const dbData = await getLiveDXNData();

  return res.json({
    status: 'online',
    ollama: {
      connected: ollamaOk,
      targetModel: OLLAMA_MODEL,
      availableModels: ollamaModels,
      url: OLLAMA_URL,
    },
    databaseContext: {
      serviciosCargados: dbData.servicios.length,
      productosCargados: dbData.especialidades.length,
      preciosCargados: dbData.precios.length,
      nosotrosCargados: dbData.nosotros.length,
      configuracionCargada: Object.keys(dbData.config).length > 0,
      timestamp: new Date(lastCacheUpdate).toISOString(),
    }
  });
}

module.exports = { prompt, status };
