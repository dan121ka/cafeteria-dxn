import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ConfiguracionResponse {
  list: Array<{ clave: string; valor: string; tipo: string; descripcion: string }>;
  map: Record<string, string>;
}

export interface Servicio {
  id: number;
  titulo: string;
  subtitulo?: string;
  descripcion: string;
  icono?: string;
  imagen?: string;
  orden: number;
  activo: number;
}

export interface Especialidad {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  beneficios?: string;
  precio: number;
  precio_caja?: number;
  imagen: string;
  badge?: string;
  orden: number;
  destacado: number;
  disponible: number;
}

export interface Nosotros {
  id: number;
  seccion: string;
  titulo: string;
  subtitulo?: string;
  contenido: string;
  imagen?: string;
  icono?: string;
  orden: number;
}

export interface PrecioItem {
  id: number;
  titulo: string;
  categoria?: string;
  precio: number;
  periodo?: string;
  descripcion?: string;
  caracteristicas: string[];
  destacado: number;
  boton_texto?: string;
  orden: number;
}

export interface GaleriaItem {
  id: number;
  titulo: string;
  descripcion?: string;
  categoria?: string;
  imagen: string;
  orden: number;
}

export interface ContactoPayload {
  nombre: string;
  email: string;
  telefono?: string;
  asunto?: string;
  mensaje: string;
}

// Datos oficiales sincronizados para GitHub Pages / Offline
const OFFLINE_CONFIG: ConfiguracionResponse = {
  list: [],
  map: {
    sitio_nombre: 'DXN CoffeeHouse',
    hero_subtitulo: 'COCHABAMBA · BOLIVIA',
    hero_titulo: 'El Mejor Café Saludable de la Ciudad',
    hero_descripcion: 'Calidad, sabor y bienestar en cada taza. Disfruta de una experiencia gourmet única infusionada con los extractos naturales de Ganoderma Lucidum (Hongo Lingzhi).',
    hero_video_url: 'videos/hero-cafeteria.mp4',
    hero_video_backup_url: 'https://videos.pexels.com/video-files/2909914/2909914-hd_1920_1080_24fps.mp4',
    hero_poster: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1920',
    direccion: 'Av. Heroínas #456 entre San Martín y 25 de Mayo, Cochabamba, Bolivia',
    telefono: '+591 4 456-7890',
    whatsapp: '+591 71234567',
    email: 'contacto@dxncoffeehouse.bo',
    horario: 'Lunes a Sábado: 07:30 - 21:30 | Domingos: 09:00 - 20:00',
    facebook_url: 'https://facebook.com/dxncoffeehouse',
    instagram_url: 'https://instagram.com/dxncoffeehouse'
  }
};

const OFFLINE_SERVICIOS: Servicio[] = [
  {
    id: 1,
    titulo: 'Barismo & Cafetería Gourmet',
    subtitulo: 'Preparación al momento',
    descripcion: 'Disfruta de espressos, cappuccinos, lattes y preparados fríos elaborados con los mejores granos y Ganoderma 100% orgánico certificado.',
    icono: 'bi-cup-hot',
    imagen: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800',
    orden: 1,
    activo: 1
  },
  {
    id: 2,
    titulo: 'Venta y Distribución DXN',
    subtitulo: 'Por mayor y menor',
    descripcion: 'Adquiere productos originales DXN en cajas y paquetes para tu hogar o negocio con asesoramiento personalizado y precios de distribuidor.',
    icono: 'bi-box-seam',
    imagen: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=800',
    orden: 2,
    activo: 1
  },
  {
    id: 3,
    titulo: 'Degustaciones y Catas de Café',
    subtitulo: 'Descubre nuevos sabores',
    descripcion: 'Participa en sesiones semanales guiadas donde aprenderás a identificar notas de sabor y conocer las variedades de Lingzhi, Mocha y Cocozhi.',
    icono: 'bi-stars',
    imagen: 'https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&w=800',
    orden: 3,
    activo: 1
  },
  {
    id: 4,
    titulo: 'Asesoría Nutricional y Salud',
    subtitulo: 'Vive con energía natural',
    descripcion: 'Nuestros especialistas te orientan sobre los increíbles beneficios antioxidantes, desintoxicantes y de refuerzo inmune de los productos Ganoderma.',
    icono: 'bi-heart-pulse',
    imagen: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=800',
    orden: 4,
    activo: 1
  },
  {
    id: 5,
    titulo: 'Espacio Coworking & WiFi',
    subtitulo: 'Trabaja con la mejor vibra',
    descripcion: 'Ambiente cómodo, enchufes en cada mesa, música acústica relajante y conexión de fibra óptica de alta velocidad mientras saboreas tu café preferido.',
    icono: 'bi-laptop',
    imagen: 'https://images.pexels.com/photos/7096/people-woman-coffee-meeting.jpg?auto=compress&cs=tinysrgb&w=800',
    orden: 5,
    activo: 1
  },
  {
    id: 6,
    titulo: 'Membresías y Afiliaciones',
    subtitulo: 'Gana consumiendo y recomendando',
    descripcion: 'Regístrate como socio DXN para obtener descuentos de por vida de hasta el 40% y generar ingresos pasivos a través de la red global de bienestar.',
    icono: 'bi-award',
    imagen: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    orden: 6,
    activo: 1
  }
];

const OFFLINE_ESPECIALIDADES: Especialidad[] = [
  {
    id: 1,
    nombre: 'Café Lingzhi 2 en 1 (Black Coffee)',
    categoria: 'Café Negro',
    descripcion: 'Café negro brasileño puro de tueste medio, libre de azúcar y enriquecido con extracto puro de Ganoderma Lucidum. Sabor intenso con notas tostadas.',
    beneficios: 'Desintoxica el organismo, acelera el metabolismo, no produce acidez estomacal ni taquicardia.',
    precio: 15.00,
    precio_caja: 140.00,
    imagen: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge: 'Top Ventas',
    orden: 1,
    destacado: 1,
    disponible: 1
  },
  {
    id: 2,
    nombre: 'Café Lingzhi 3 en 1',
    categoria: 'Café con Leche',
    descripcion: 'La combinación perfecta de granos selectos de café, crema vegetal no láctea de fácil digestión y extracto de hongo Lingzhi con un toque justo de dulzor.',
    beneficios: 'Aporte energético sostenido, refuerza defensas inmunológicas y equilibra los niveles de estrés.',
    precio: 18.00,
    precio_caja: 155.00,
    imagen: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge: 'Favorito del Público',
    orden: 2,
    destacado: 1,
    disponible: 1
  },
  {
    id: 3,
    nombre: 'Zhi Mocha Gourmet',
    categoria: 'Especialidad',
    descripcion: 'Deliciosa fusión entre café aromático, cacao natural premium y Ganoderma. Coronada con espuma aterciopelada y lluvia de chocolate amargo.',
    beneficios: 'Potente antioxidante, estimula la concentración mental y mejora el estado de ánimo naturalmente.',
    precio: 22.00,
    precio_caja: 175.00,
    imagen: 'https://images.pexels.com/photos/230588/pexels-photo-230588.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge: 'Recomendación Barista',
    orden: 3,
    destacado: 1,
    disponible: 1
  },
  {
    id: 4,
    nombre: 'Cocozhi Chocolate Caliente',
    categoria: 'Chocolates & Malteadas',
    descripcion: 'Bebida reconfortante de cacao de primera calidad y extracto de Ganoderma joven (micelio). Apto para niños, jóvenes y adultos.',
    beneficios: 'Promueve un sueño reparador, nutre el sistema nervioso y fortalece la memoria y concentración.',
    precio: 20.00,
    precio_caja: 160.00,
    imagen: 'https://images.pexels.com/photos/373888/pexels-photo-373888.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge: 'Para toda la familia',
    orden: 4,
    destacado: 1,
    disponible: 1
  },
  {
    id: 5,
    nombre: 'Spica Tea (Té Herbal)',
    categoria: 'Tés e Infusiones',
    descripcion: 'Infusión milenaria con cinco hierbas tradicionales chinas incluyendo Spica Prunellae, cáscara de mandarina y Ganoderma.',
    beneficios: 'Refresca el sistema digestivo, calma dolores de garganta y ayuda a regular la temperatura corporal.',
    precio: 14.00,
    precio_caja: 130.00,
    imagen: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge: '100% Natural',
    orden: 5,
    destacado: 0,
    disponible: 1
  },
  {
    id: 6,
    nombre: 'Café con Cordyceps',
    categoria: 'Bebidas Energéticas',
    descripcion: 'Café de aroma seductor formulado con extracto de Cordyceps Sinensis. Diseñado para deportistas y jornadas exigentes.',
    beneficios: 'Aumenta la oxigenación celular, resistencia física, vigor y protección renal y pulmonar.',
    precio: 24.00,
    precio_caja: 190.00,
    imagen: 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge: 'Energía Pura',
    orden: 6,
    destacado: 1,
    disponible: 1
  }
];

const OFFLINE_NOSOTROS: Nosotros[] = [
  {
    id: 1,
    seccion: 'historia',
    titulo: 'Nuestra Historia & Pasión',
    subtitulo: 'De la naturaleza a tu taza en Cochabamba',
    contenido: 'DXN CoffeeHouse nació con el sueño de ofrecer un espacio acogedor donde el placer de tomar un café delicioso se una a la salud integral. Fundada bajo la filosofía de DXN International —líder mundial en el cultivo biológico de Ganoderma Lucidum— nuestra cafetería en Cochabamba selecciona los mejores granos y los fusiona con hierbas milenarias para entregarte bienestar en cada sorbo. Nos enorgullece ser un punto de encuentro para familias, emprendedores y amantes del buen café.',
    imagen: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=1200',
    icono: 'bi-compass',
    orden: 1
  },
  {
    id: 2,
    seccion: 'ganoderma',
    titulo: 'El Rey de las Hierbas: Ganoderma Lucidum',
    subtitulo: 'Milenios de sabiduría oriental aplicados a tu salud',
    contenido: 'Conocido en Asia como "El Hongo de la Inmortalidad" o Lingzhi, el Ganoderma Lucidum contiene más de 400 nutrientes activos y 150 antioxidantes. A diferencia del café común que puede irritar el estómago o provocar taquicardia, el café DXN neutraliza la acidez y ayuda a desintoxicar las células, regular la presión arterial y vigorizar el sistema inmunológico.',
    imagen: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1200',
    icono: 'bi-shield-check',
    orden: 2
  },
  {
    id: 3,
    seccion: 'mision_vision',
    titulo: 'Nuestra Misión y Visión',
    subtitulo: 'Bienestar, calidad y calidez humana',
    contenido: 'Nuestra misión es transformar la rutina diaria del café en un hábito de nutrición y bienestar preventivo, brindando un servicio cálido en un ambiente inspirador. Aspiramos a ser el referente número uno de cafeterías saludables en Bolivia, cultivando una comunidad apasionada por la vida activa y consciente.',
    imagen: 'https://images.pexels.com/photos/2074122/pexels-photo-2074122.jpeg?auto=compress&cs=tinysrgb&w=1200',
    icono: 'bi-eye',
    orden: 3
  },
  {
    id: 4,
    seccion: 'tienda',
    titulo: 'Nuestra Tienda & Experiencia en Cochabamba',
    subtitulo: 'Un espacio diseñado para tus mejores momentos',
    contenido: 'Ubicados en el corazón de Cochabamba, contamos con instalaciones modernas diseñadas para desconectar del ritmo acelerado de la ciudad. Podrás saborear tu bebida en barra o cómodos sillones, explorar nuestro anaquel con la línea completa de productos DXN y recibir el asesoramiento de nuestros baristas certificados.',
    imagen: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=1200',
    icono: 'bi-shop',
    orden: 4
  }
];

const OFFLINE_PRECIOS: PrecioItem[] = [
  {
    id: 1,
    titulo: 'Taza Individual Barista',
    categoria: 'Cafetería',
    precio: 15.00,
    periodo: 'por taza',
    descripcion: 'Ideal para tu dosis diaria de energía saludable preparada fresca al instante.',
    caracteristicas: [
      '1 Taza de Café Lingzhi o Té a elección',
      'Preparación en barra con leche vegetal opcional',
      'Galleta artesanal de cortesía',
      'Acceso libre a WiFi de alta velocidad'
    ],
    destacado: 0,
    boton_texto: 'Pedir en Barra',
    orden: 1
  },
  {
    id: 2,
    titulo: 'Combo Degustación DXN',
    categoria: 'Promoción Especial',
    precio: 35.00,
    periodo: 'por combo',
    descripcion: 'La mejor forma de probar y comparar nuestras variedades más queridas.',
    caracteristicas: [
      '2 Tazas Gourmet (Lingzhi 3 en 1 + Zhi Mocha)',
      '1 Porción de repostería saludable',
      'Muestra informativa sobre beneficios del Ganoderma',
      'Asesoría personalizada con nuestro barista'
    ],
    destacado: 1,
    boton_texto: 'Ordenar Combo',
    orden: 2
  },
  {
    id: 3,
    titulo: 'Pack Familiar Bienestar',
    categoria: 'Para Llevar',
    precio: 180.00,
    periodo: 'por paquete',
    descripcion: 'Llévate tus productos favoritos a casa con un descuento exclusivo por paquete.',
    caracteristicas: [
      '1 Caja completa de Café Lingzhi 2 en 1 o 3 en 1',
      '1 Caja de Cocozhi o Spica Tea',
      '1 Taza térmica exclusiva DXN CoffeeHouse',
      'Guía de preparación y recetas saludables'
    ],
    destacado: 0,
    boton_texto: 'Llevar Pack',
    orden: 3
  },
  {
    id: 4,
    titulo: 'Membresía Socio DXN',
    categoria: 'Membresía Vitalicia',
    precio: 250.00,
    periodo: 'pago único',
    descripcion: 'Únete a la familia global DXN con código internacional y precios mayoristas.',
    caracteristicas: [
      'Descuento de por vida de hasta el 40% en toda la línea',
      'Kit de bienvenida con muestras y catálogo oficial',
      'Código internacional de distribuidor independiente',
      'Acceso a capacitaciones gratuitas de salud y negocio'
    ],
    destacado: 1,
    boton_texto: 'Afiliarme Ahora',
    orden: 4
  }
];

const OFFLINE_GALERIA: GaleriaItem[] = [
  {
    id: 1,
    titulo: 'Barra de Café y Baristas',
    descripcion: 'Nuestros baristas preparando un espresso Lingzhi perfecto',
    categoria: 'Cafetería',
    imagen: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
    orden: 1
  },
  {
    id: 2,
    titulo: 'Ambiente Acogedor y Cómodo',
    descripcion: 'Salón principal con iluminación cálida y música relajante',
    categoria: 'Local',
    imagen: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=800',
    orden: 2
  },
  {
    id: 3,
    titulo: 'Variedad de Bebidas DXN',
    descripcion: 'Presentación de bebidas frías y calientes con Ganoderma',
    categoria: 'Productos',
    imagen: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800',
    orden: 3
  },
  {
    id: 4,
    titulo: 'Espacio de Lectura y Coworking',
    descripcion: 'Mesas equipadas para concentrarte y disfrutar',
    categoria: 'Local',
    imagen: 'https://images.pexels.com/photos/7096/people-woman-coffee-meeting.jpg?auto=compress&cs=tinysrgb&w=800',
    orden: 4
  },
  {
    id: 5,
    titulo: 'Cuidado en los Detalles',
    descripcion: 'Tostado artesanal y emulsión suave en cada taza',
    categoria: 'Cafetería',
    imagen: 'https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&w=800',
    orden: 5
  },
  {
    id: 6,
    titulo: 'Área de Tienda DXN',
    descripcion: 'Estanterías con toda la línea oficial de nutrición y bienestar',
    categoria: 'Tienda',
    imagen: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=800',
    orden: 6
  }
];

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';

  getConfiguracion(): Observable<ConfiguracionResponse> {
    return this.http.get<ConfiguracionResponse>(`${this.baseUrl}/configuracion`).pipe(
      catchError(() => of(OFFLINE_CONFIG))
    );
  }

  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.baseUrl}/servicios`).pipe(
      catchError(() => of(OFFLINE_SERVICIOS))
    );
  }

  getEspecialidades(categoria?: string): Observable<Especialidad[]> {
    const url = categoria
      ? `${this.baseUrl}/especialidades?categoria=${encodeURIComponent(categoria)}`
      : `${this.baseUrl}/especialidades`;
    return this.http.get<Especialidad[]>(url).pipe(
      catchError(() => {
        if (!categoria || categoria === 'Todas') {
          return of(OFFLINE_ESPECIALIDADES);
        }
        return of(OFFLINE_ESPECIALIDADES.filter(e => e.categoria === categoria));
      })
    );
  }

  getCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/especialidades/categorias`).pipe(
      catchError(() => of(['Café Negro', 'Café con Leche', 'Especialidad', 'Chocolates & Malteadas', 'Tés e Infusiones', 'Bebidas Energéticas']))
    );
  }

  getNosotros(): Observable<Nosotros[]> {
    return this.http.get<Nosotros[]>(`${this.baseUrl}/nosotros`).pipe(
      catchError(() => of(OFFLINE_NOSOTROS))
    );
  }

  getPrecios(): Observable<PrecioItem[]> {
    return this.http.get<PrecioItem[]>(`${this.baseUrl}/precios`).pipe(
      catchError(() => of(OFFLINE_PRECIOS))
    );
  }

  getGaleria(): Observable<GaleriaItem[]> {
    return this.http.get<GaleriaItem[]>(`${this.baseUrl}/galeria`).pipe(
      catchError(() => of(OFFLINE_GALERIA))
    );
  }

  enviarContacto(data: ContactoPayload): Observable<{ message: string; data: any }> {
    return this.http.post<{ message: string; data: any }>(`${this.baseUrl}/contactos`, data).pipe(
      catchError(() => of({ message: '¡Gracias por contactarnos! Tu mensaje ha sido registrado exitosamente.', data }))
    );
  }
}
