import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  source?: string;
  note?: string;
}

export interface ChatbotStatusResponse {
  status: string;
  ollama: {
    connected: boolean;
    targetModel: string;
    availableModels: string[];
    url: string;
  };
  databaseContext: {
    serviciosCargados: number;
    productosCargados: number;
    preciosCargados: number;
    nosotrosCargados: number;
    configuracionCargada: boolean;
    timestamp: string;
  };
}

function clientSmartBarista(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('servicio') || q.includes('wifi') || q.includes('coworking') || q.includes('ofrecen')) {
    return '¡En DXN CoffeeHouse te ofrecemos:\n• Barismo & Cafetería Gourmet\n• Venta y Distribución oficial DXN\n• Degustaciones y Catas guiadas\n• Asesoría Nutricional y Salud\n• Espacio Coworking & WiFi de alta velocidad\n• Membresías y Afiliaciones con hasta 40% de descuento.';
  }
  if (q.includes('precio') || q.includes('costo') || q.includes('cuesta') || q.includes('combo') || q.includes('membresia')) {
    return 'Nuestras tazas van de 14 Bs a 24 Bs. El Combo Degustación está a 35 Bs, el Pack Familiar a 180 Bs y la Membresía Oficial DXN vitalicia con 40% de descuento a 250 Bs.';
  }
  if (q.includes('ubicacion') || q.includes('donde') || q.includes('direccion') || q.includes('horario')) {
    return 'Estamos en Cochabamba: Av. Heroínas #456 entre San Martín y 25 de Mayo. Atendemos de Lunes a Sábado de 07:30 a 21:30 y Domingos de 09:00 a 20:00. WhatsApp: +591 71234567.';
  }
  if (q.includes('ganoderma') || q.includes('salud') || q.includes('gastritis') || q.includes('diabetes')) {
    return 'El café DXN está infusionado con Ganoderma Lucidum (Hongo Lingzhi). Es un café alcalino que no irrita el estómago ni produce taquicardia, aportando más de 150 antioxidantes naturales.';
  }
  return '¡Hola! Bienvenido a DXN CoffeeHouse Cochabamba. Preparamos el mejor café saludable infusionado con Ganoderma. ¿Deseas consultar sobre nuestro menú, precios, servicios o ubicación?';
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/chatbot';

  sendMessage(
    prompt: string,
    history: ChatMessage[] = []
  ): Observable<{ response: string; source?: string; note?: string }> {
    const historyPayload = history.slice(-6).map(m => ({
      sender: m.sender,
      text: m.text
    }));
    return this.http.post<{ response: string; source?: string; note?: string }>(this.apiUrl, {
      prompt,
      history: historyPayload
    }).pipe(
      catchError(() => {
        return of({
          response: clientSmartBarista(prompt),
          source: 'dxn_advisor_web_client',
          note: 'Respuesta generada en modo offline/web.'
        });
      })
    );
  }

  getStatus(): Observable<ChatbotStatusResponse> {
    return this.http.get<ChatbotStatusResponse>(`${this.apiUrl}/status`).pipe(
      catchError(() => of({
        status: 'web_mode',
        ollama: { connected: false, targetModel: 'gemma3', availableModels: [], url: 'http://localhost:11434' },
        databaseContext: { serviciosCargados: 6, productosCargados: 6, preciosCargados: 4, nosotrosCargados: 4, configuracionCargada: true, timestamp: new Date().toISOString() }
      }))
    );
  }
}
