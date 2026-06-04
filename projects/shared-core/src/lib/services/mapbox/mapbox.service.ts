import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  private http = inject(HttpClient);
  
  // Usamos Geocoding V5: Estable, no pide session_tokens y es ultra rápido
  private readonly baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  buscarDireccion(query: string, token: string): Observable<any[]> {
    if (!query || query.trim().length < 3) return of([]);

    // Construimos la URL de Geocoding. Se le pasa el texto en la propia ruta.
    const url = `${this.baseUrl}/${encodeURIComponent(query)}.json?access_token=${token}&language=es&country=es&types=address,place,poi&limit=5`;

    return this.http.get<any>(url).pipe(
      map(res => {
        const features = res.features || [];
        // Mapeamos los resultados de v5 para que tu HTML no note la diferencia y siga funcionando igual
        return features.map((f: any) => ({
          name: f.text, // El nombre de la calle
          place_formatted: f.place_name // La dirección completa formateada
        }));
      }),
      catchError(error => {
        console.error('Error consultando Mapbox:', error);
        return of([]);
      })
    );
  }
}