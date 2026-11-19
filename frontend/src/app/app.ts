import { Component, OnInit, AfterViewInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ApiService,
  Servicio,
  Especialidad,
  Nosotros,
  PrecioItem,
  GaleriaItem,
  ContactoPayload
} from './services/api.service';
import { ChatbotService, ChatMessage } from './services/chatbot.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, AfterViewInit {
  private api = inject(ApiService);
  private chatbot = inject(ChatbotService);

  // URL del video Hero computada (compatible con localhost y GitHub Pages)
  videoUrl = computed(() => {
    const val = this.config()['hero_video_url'];
    if (!val || val.includes('hero-cafeteria.mp4')) {
      return 'videos/hero-cafeteria.mp4';
    }
    if (val.startsWith('http://') || val.startsWith('https://')) {
      return val;
    }
    return val.startsWith('/') ? val.slice(1) : val;
  });

  // Datos principales desde la Base de Datos
  config = signal<Record<string, string>>({});
  servicios = signal<Servicio[]>([]);
  especialidades = signal<Especialidad[]>([]);
  todasEspecialidades = signal<Especialidad[]>([]);
  categorias = signal<string[]>([]);
  categoriaActiva = signal<string>('Todas');
  nosotros = signal<Nosotros[]>([]);
  precios = signal<PrecioItem[]>([]);
  galeria = signal<GaleriaItem[]>([]);

  // Estados de carga
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Formulario de Contacto
  contactoForm: ContactoPayload = {
    nombre: '',
    email: '',
    telefono: '',
    asunto: 'Consulta sobre café DXN',
    mensaje: ''
  };
  contactoEnviando = signal<boolean>(false);
  contactoMensajeExito = signal<string | null>(null);
  contactoMensajeError = signal<string | null>(null);

  // Chatbot Flotante
  chatAbierto = signal<boolean>(false);
  chatCargando = signal<boolean>(false);
  chatInput = '';
  mensajes = signal<ChatMessage[]>([
    {
      sender: 'bot',
      text: '¡Hola! Bienvenido a DXN CoffeeHouse. Soy tu Barista Virtual y Asesor Nutricional. ¿En qué puedo orientarte hoy? Puedes preguntarme sobre los beneficios del Ganoderma, nuestro menú de cafés, precios o ubicación.',
      timestamp: new Date(),
    }
  ]);

  preguntasSugeridas: string[] = [
    '¿Qué beneficios tiene el café con Ganoderma?',
    '¿Cuál es el menú de especialidades y precios?',
    '¿Dónde están ubicados en Cochabamba?',
    '¿Cómo funciona la membresía con descuento?'
  ];

  // Menú móvil
  menuMovilAbierto = signal<boolean>(false);

  encodeUri(val: string): string {
    return encodeURIComponent(val || '');
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngAfterViewInit(): void {
    this.iniciarVideoHero();
    // Soporte para navegadores con bloqueo estricto (Brave Shields / Chrome autoplay policy)
    const desbloquear = () => {
      this.iniciarVideoHero();
      window.removeEventListener('click', desbloquear);
      window.removeEventListener('touchstart', desbloquear);
      window.removeEventListener('scroll', desbloquear);
    };
    window.addEventListener('click', desbloquear, { passive: true });
    window.addEventListener('touchstart', desbloquear, { passive: true });
    window.addEventListener('scroll', desbloquear, { passive: true });
  }

  iniciarVideoHero(): void {
    setTimeout(() => {
      const video = document.getElementById('heroVideoPlayer') as HTMLVideoElement;
      if (video) {
        video.muted = true;
        video.defaultMuted = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Autoplay pausado por el navegador (iniciará con interacción):', err.message);
          });
        }
      }
    }, 50);
  }

  cargarDatos(): void {
    this.loading.set(true);
    this.error.set(null);

    // 1. Cargar Configuración General
    this.api.getConfiguracion().subscribe({
      next: (res) => {
        this.config.set(res.map);
        this.iniciarVideoHero();
      },
      error: (err) => console.error('Error cargando configuración:', err)
    });

    // 2. Cargar Servicios
    this.api.getServicios().subscribe({
      next: (data) => this.servicios.set(data),
      error: (err) => console.error('Error cargando servicios:', err)
    });

    // 3. Cargar Especialidades y Categorías
    this.api.getEspecialidades().subscribe({
      next: (data) => {
        this.todasEspecialidades.set(data);
        this.especialidades.set(data);
      },
      error: (err) => console.error('Error cargando especialidades:', err)
    });

    this.api.getCategorias().subscribe({
      next: (cats) => this.categorias.set(['Todas', ...cats]),
      error: (err) => console.error('Error cargando categorías:', err)
    });

    // 4. Cargar Sección Nosotros
    this.api.getNosotros().subscribe({
      next: (data) => this.nosotros.set(data),
      error: (err) => console.error('Error cargando nosotros:', err)
    });

    // 5. Cargar Precios
    this.api.getPrecios().subscribe({
      next: (data) => this.precios.set(data),
      error: (err) => console.error('Error cargando precios:', err)
    });

    // 6. Cargar Galería
    this.api.getGaleria().subscribe({
      next: (data) => {
        this.galeria.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando galería:', err);
        this.loading.set(false);
      }
    });
  }

  filtrarCategoria(cat: string): void {
    this.categoriaActiva.set(cat);
    if (cat === 'Todas') {
      this.especialidades.set(this.todasEspecialidades());
    } else {
      this.especialidades.set(
        this.todasEspecialidades().filter((item) => item.categoria === cat)
      );
    }
  }

  scrollTo(sectionId: string): void {
    this.menuMovilAbierto.set(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  toggleMenuMovil(): void {
    this.menuMovilAbierto.update(v => !v);
  }

  // Enviar mensaje de contacto
  enviarContacto(): void {
    if (!this.contactoForm.nombre || !this.contactoForm.email || !this.contactoForm.mensaje) {
      this.contactoMensajeError.set('Por favor completa los campos requeridos (Nombre, Correo y Mensaje).');
      return;
    }

    this.contactoEnviando.set(true);
    this.contactoMensajeExito.set(null);
    this.contactoMensajeError.set(null);

    this.api.enviarContacto(this.contactoForm).subscribe({
      next: (res) => {
        this.contactoEnviando.set(false);
        this.contactoMensajeExito.set(res.message || '¡Mensaje enviado con éxito! Nos comunicaremos contigo pronto.');
        this.contactoForm = {
          nombre: '',
          email: '',
          telefono: '',
          asunto: 'Consulta sobre café DXN',
          mensaje: ''
        };
      },
      error: (err) => {
        this.contactoEnviando.set(false);
        this.contactoMensajeError.set('Ocurrió un error al enviar tu mensaje. Por favor intenta de nuevo.');
        console.error('Error al enviar contacto:', err);
      }
    });
  }

  // Gestión de Chatbot
  toggleChat(): void {
    this.chatAbierto.update(v => !v);
  }

  enviarPreguntaRapida(pregunta: string): void {
    this.chatInput = pregunta;
    this.enviarMensajeChat();
  }

  enviarMensajeChat(): void {
    const texto = this.chatInput.trim();
    if (!texto || this.chatCargando()) return;

    // Agregar mensaje del usuario
    const nuevoMensajeUsuario: ChatMessage = { sender: 'user', text: texto, timestamp: new Date() };
    const historialPrevio = [...this.mensajes()];

    this.mensajes.update(list => [...list, nuevoMensajeUsuario]);
    this.chatInput = '';
    this.chatCargando.set(true);

    this.chatbot.sendMessage(texto, historialPrevio).subscribe({
      next: (res) => {
        this.chatCargando.set(false);
        this.mensajes.update(list => [
          ...list,
          {
            sender: 'bot',
            text: res.response,
            timestamp: new Date(),
            source: res.source
          }
        ]);
        this.scrollChatAlFinal();
      },
      error: (err) => {
        this.chatCargando.set(false);
        this.mensajes.update(list => [
          ...list,
          {
            sender: 'bot',
            text: 'Lo siento, tuve un problema al procesar tu solicitud. Pero recuerda que puedes contactarnos directamente al WhatsApp +591 71234567 o visitarnos en Cochabamba.',
            timestamp: new Date()
          }
        ]);
        this.scrollChatAlFinal();
      }
    });
  }

  scrollChatAlFinal(): void {
    setTimeout(() => {
      const chatBody = document.getElementById('chatMessagesContainer');
      if (chatBody) {
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    }, 100);
  }
}
