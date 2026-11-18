import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';

  getConfiguracion(): Observable<ConfiguracionResponse> {
    return this.http.get<ConfiguracionResponse>(`${this.baseUrl}/configuracion`);
  }

  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.baseUrl}/servicios`);
  }

  getEspecialidades(categoria?: string): Observable<Especialidad[]> {
    const url = categoria
      ? `${this.baseUrl}/especialidades?categoria=${encodeURIComponent(categoria)}`
      : `${this.baseUrl}/especialidades`;
    return this.http.get<Especialidad[]>(url);
  }

  getCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/especialidades/categorias`);
  }

  getNosotros(): Observable<Nosotros[]> {
    return this.http.get<Nosotros[]>(`${this.baseUrl}/nosotros`);
  }

  getPrecios(): Observable<PrecioItem[]> {
    return this.http.get<PrecioItem[]>(`${this.baseUrl}/precios`);
  }

  getGaleria(): Observable<GaleriaItem[]> {
    return this.http.get<GaleriaItem[]>(`${this.baseUrl}/galeria`);
  }

  enviarContacto(data: ContactoPayload): Observable<{ message: string; data: any }> {
    return this.http.post<{ message: string; data: any }>(`${this.baseUrl}/contactos`, data);
  }
}
