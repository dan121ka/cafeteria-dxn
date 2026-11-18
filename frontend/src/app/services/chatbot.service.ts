import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  source?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/chatbot';

  sendMessage(prompt: string): Observable<{ response: string; source?: string; note?: string }> {
    return this.http.post<{ response: string; source?: string; note?: string }>(this.apiUrl, { prompt });
  }
}
