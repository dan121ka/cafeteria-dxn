import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    // Enviar historial reciente formateado para conversación fluida
    const historyPayload = history.slice(-6).map(m => ({
      sender: m.sender,
      text: m.text
    }));
    return this.http.post<{ response: string; source?: string; note?: string }>(this.apiUrl, {
      prompt,
      history: historyPayload
    });
  }

  getStatus(): Observable<ChatbotStatusResponse> {
    return this.http.get<ChatbotStatusResponse>(`${this.apiUrl}/status`);
  }
}
