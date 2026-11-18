const CONTEXTO_DXN = `
Eres el Barista Virtual y Asesor Nutricional de "DXN CoffeeHouse", la cafetería gourmet y saludable número uno en Cochabamba, Bolivia.
Tu misión es atender a los clientes con amabilidad, calidez, entusiasmo y conocimiento profesional.

Información clave sobre DXN CoffeeHouse:
1. Especialidad: Café gourmet infusionado con extracto 100% puro y orgánico de Ganoderma Lucidum (Hongo Lingzhi).
2. Beneficios de nuestro café:
   - No produce acidez ni gastritis (es alcalino).
   - No genera taquicardia ni nerviosismo (bajo en cafeína natural).
   - Aporta más de 400 nutrientes activos y 150 antioxidantes.
   - Fortalece el sistema inmune, desintoxica el organismo y mejora la energía celular.
3. Productos destacados:
   - Café Lingzhi 2 en 1 (Black Coffee): Café negro sin azúcar para desintoxicar y bajar de peso (15 Bs la taza / 140 Bs la caja).
   - Café Lingzhi 3 en 1: Suave y cremoso con sustituto de crema vegetal y azúcar de caña baja (18 Bs la taza / 155 Bs la caja).
   - Zhi Mocha Gourmet: Café con cacao premium y Ganoderma con espuma aterciopelada (22 Bs la taza / 175 Bs la caja).
   - Cocozhi: Chocolate suizo reconfortante con Ganoderma para niños y adultos (20 Bs la taza / 160 Bs la caja).
   - Spica Tea: Infusión milenaria digestiva y refrescante (14 Bs la taza / 130 Bs la caja).
   - Café con Cordyceps: Máxima energía y vitalidad física (24 Bs la taza / 190 Bs la caja).
4. Ubicación y Horarios:
   - Av. Heroínas #456 entre San Martín y 25 de Mayo, Cochabamba, Bolivia.
   - Lunes a Sábado: 07:30 - 21:30 | Domingos: 09:00 - 20:00.
   - WhatsApp de contacto: +591 71234567.
5. Membresía DXN:
   - Por 250 Bs obtienes código internacional, kit de bienvenida y descuentos vitalicios de hasta el 40%.

Estilo de respuesta:
- Habla en español, de forma cercana, educada y profesional.
- Sé conciso pero informativo (1 a 3 párrafos como máximo).
- Si te preguntan de temas ajenos a la cafetería, café o bienestar, redirige cortésmente hacia nuestros productos o servicios.
`;

const OLLAMA_URL = (process.env.OLLAMA_URL || 'http://127.0.0.1:11434').replace(/\/+$/, '');
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma3';
const OLLAMA_TIMEOUT_MS = 30000;
const MAX_PROMPT_LENGTH = 3000;

function fallbackResponse(question) {
  const q = question.toLowerCase();
  if (q.includes('ganoderma') || q.includes('lingzhi') || q.includes('hongo')) {
    return '¡Excelente pregunta! El Ganoderma Lucidum (Lingzhi) es un hongo milenario con más de 150 antioxidantes. En DXN CoffeeHouse lo combinamos con café gourmet para brindarte energía limpia que no irrita el estómago ni produce taquicardia, a la vez que refuerza tu sistema inmune. ¿Te gustaría conocer nuestras variedades 2 en 1 (negro) o 3 en 1?';
  }
  if (q.includes('precio') || q.includes('costo') || q.includes('caja') || q.includes('cuanto')) {
    return 'Nuestras tazas preparadas en barra van desde 14 Bs (Spica Tea) hasta 24 Bs (Cordyceps Coffee). Las cajas para preparar en casa van de 130 Bs a 190 Bs. También ofrecemos la Membresía DXN por 250 Bs con hasta 40% de descuento de por vida.';
  }
  if (q.includes('ubicacion') || q.includes('donde') || q.includes('direccion') || q.includes('horario')) {
    return 'Nos encontramos en Cochabamba, Bolivia: Av. Heroínas #456 entre San Martín y 25 de Mayo. Atendemos de Lunes a Sábado de 07:30 a 21:30 y Domingos de 09:00 a 20:00. ¡Te esperamos para una deliciosa taza caliente!';
  }
  if (q.includes('membresia') || q.includes('afilia') || q.includes('socio') || q.includes('descuento')) {
    return '¡Puedes afiliarte a la familia DXN! Con un pago único de 250 Bs obtienes tu código internacional de socio distribuidor, un kit de bienvenida y descuentos vitalicios de hasta 40% en todos los productos.';
  }
  if (q.includes('mocha') || q.includes('chocolate') || q.includes('cocozhi')) {
    return '¡Son nuestras bebidas más consentidas! El Zhi Mocha combina café aromático, cacao natural y Ganoderma (22 Bs), mientras que el Cocozhi es un delicioso chocolate suizo nutritivo ideal para toda la familia (20 Bs).';
  }
  return '¡Hola! Bienvenido a DXN CoffeeHouse Cochabamba. Ofrecemos el mejor café gourmet saludable infusionado con Ganoderma Lucidum para cuidar tu bienestar y darte energía natural. Puedes preguntarme sobre nuestro menú, precios, beneficios a la salud o nuestra ubicación.';
}

async function prompt(req, res) {
  const { prompt: question } = req.body;
  if (!question || typeof question !== 'string' || !question.trim() || question.length > MAX_PROMPT_LENGTH) {
    return res.status(400).json({ error: `El prompt debe ser un texto de hasta ${MAX_PROMPT_LENGTH} caracteres` });
  }

  const cleanQuestion = question.trim();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        system: CONTEXTO_DXN,
        prompt: cleanQuestion,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      if (data && typeof data.response === 'string') {
        return res.json({ response: data.response.trim(), source: 'ollama' });
      }
    }
    // Si Ollama respondió con error de modelo u otro estado
    console.warn(`[Chatbot] Ollama respondió con estado ${response.status}. Usando fallback DXN.`);
    const fallback = fallbackResponse(cleanQuestion);
    return res.json({ response: fallback, source: 'dxn_advisor_fallback' });
  } catch (error) {
    clearTimeout(timeout);
    console.warn(`[Chatbot] No se pudo conectar a Ollama en ${OLLAMA_URL} (${error.message}). Usando respuesta del Barista DXN.`);
    const fallback = fallbackResponse(cleanQuestion);
    return res.json({
      response: fallback,
      source: 'dxn_advisor_fallback',
      note: 'Ollama local no disponible en este momento. Asistente en modo Barista DXN.'
    });
  }
}

module.exports = { prompt };
