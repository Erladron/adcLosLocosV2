import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * @interface MapboxSuggestion
 * @description Contrato estructural que define el formato normalizado de las sugerencias de direcciones
 * devueltas por el servicio de geocodificación para el consumo de los componentes visuales.
 */
export interface MapboxSuggestion {
  /** @description Nombre corto o principal de la localización o vía (ej: "Calle Serrano"). */
  name: string;
  /** @description Dirección completa, normalizada y formateada por la API geográfica (ej: "Calle Serrano, 24, Madrid, España"). */
  place_formatted: string;
}

/**
 * @class MapboxService
 * @description Servicio de infraestructura especialista encargado de interactuar con las APIs REST de Mapbox.
 * Provee capacidades de Geocoding síncronas y autocompletado inteligente de direcciones postales en territorio español.
 */
@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  
  /** @description Instancia inyectada del cliente HTTP de Angular para la realización de llamadas REST. @private */
  private http = inject(HttpClient);
  
  /** 
   * @description Endpoint base oficial de Geocoding V5. Seleccionado por su alta velocidad y estabilidad sin requerir tokens de sesión de mapa.
   * @private 
   * @readonly
   */
  private readonly baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  /**
   * @constructor
   * @description Inicializa el servicio de localización geográfica.
   */
  constructor() { }

  /**
   * @method buscarDireccion
   * @description Realiza una consulta asíncrona a la API de Mapbox para obtener sugerencias de direcciones coincidentes.
   * Acota los resultados geográficos estrictamente a España ('country=es') y a lenguaje castellano ('language=es').
   * @param {string} query Texto o cadena parcial de la dirección introducida por el usuario.
   * @param {string} token Clave pública o API Access Token de Mapbox configurada en los entornos.
   * @returns {Observable<MapboxSuggestion[]>} Flujo observable que emite una matriz de hasta 5 sugerencias normalizadas.
   */
  public buscarDireccion(query: string, token: string): Observable<MapboxSuggestion[]> {
    if (!query || query.trim().length < 3) return of([]);

    // Construcción de la URL parametrizada aplicando encoding para caracteres especiales
    const url = `${this.baseUrl}/${encodeURIComponent(query)}.json?access_token=${token}&language=es&country=es&types=address,place,poi&limit=5`;

    return this.http.get<any>(url).pipe(
      map(res => {
        const features = res.features || [];
        
        // Mapeo adaptativo estructural intermedio para mantener compatibilidad HTML/UI
        return features.map((f: any) => ({
          name: f.text, // Nombre de la calle
          place_formatted: f.place_name // Dirección completa formateada
        }));
      }),
      catchError(error => {
        // Log defensivo de infraestructura en consola para auditoría
        console.error('🚨 [MapboxService] Error de comunicación con las pasarelas de Mapbox:', error);
        // Fallback resiliente: evita la rotura del hilo reactivo de la UI devolviendo una matriz vacía
        return of([]);
      })
    );
  }
}