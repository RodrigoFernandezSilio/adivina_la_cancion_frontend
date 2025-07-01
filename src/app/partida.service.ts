import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ErrorBoxService } from './error-box.service';
import { Partida, PartidaDTO, PartidaPreview } from './partida';

@Injectable({
  providedIn: 'root'
})
export class PartidaService {

  partida: PartidaPreview | null = null;

  partidasURL = "http://localhost:8080/partidas"

  constructor(private http: HttpClient, private errorBoxService: ErrorBoxService) { }

  obtenerPartidas(): Observable<PartidaPreview[]> {
    console.log(`Obteniendo partidas...`)

    const url = this.partidasURL;

    return this.http.get<PartidaPreview[]>(url).pipe(
      tap(_ => {
        console.log(`Partidas obtenidas`)
      })
    );
  }

  crearPartida(partidaDTO: PartidaDTO): Observable<PartidaPreview> {
    console.log("Creando partida...");

    const url = `${this.partidasURL}`;

    return this.http.post<PartidaPreview>(url, partidaDTO).pipe(
      tap(partidaPreview => {
        this.partida = partidaPreview
        console.log(`Partida creada`);
      }),
      catchError(error => {
        console.error('Error al crear la partida', error);

        // Manejo del error 500
        if (error.status === 500) {
          this.errorBoxService.agregarError('Error interno del servidor. Intenta más tarde.');
        }
        // Manejo de errores cuando no hay respuesta del servidor
        else if (error.status === 0) {
          this.errorBoxService.agregarError('No se pudo conectar al servidor. Verifica tu conexión a internet o intenta más tarde.');
        }
        return throwError(() => new Error(error.message || 'Error desconocido'));
      })
    );
  }

  anhadirUsuarioAux(partida: PartidaPreview, usuarioID: number, codigoAcceso?: string): Observable<PartidaPreview> {
    this.partida = partida;

    return this.anhadirUsuario(partida.id, usuarioID, codigoAcceso);
  }

  anhadirUsuario(partidaID: number, usuarioID: number, codigoAcceso?: string): Observable<PartidaPreview> {
    console.log(`Añadiendo usuario ${usuarioID} a partida ${partidaID}...`);

    let url = `${this.partidasURL}/${partidaID}/${usuarioID}/anhadirUsuario`;
    if (codigoAcceso) {
      url += `?codigoAcceso=${encodeURIComponent(codigoAcceso)}`;
    }

    return this.http.put<PartidaPreview>(url, {}).pipe(
      tap(partidaPreview => {
        this.partida = partidaPreview;
        console.log(`Usuario anhadido`);
      }),
      catchError(error => {
        console.error('Error al anhadir el usuario', error);

        // Manejo del error 500
        if (error.status === 500) {
          this.errorBoxService.agregarError('Error interno del servidor. Intenta más tarde.');
        }
        // Manejo de errores cuando no hay respuesta del servidor
        else if (error.status === 0) {
          this.errorBoxService.agregarError('No se pudo conectar al servidor. Verifica tu conexión a internet o intenta más tarde.');
        }
        return throwError(() => new Error(error.message || 'Error desconocido'));
      })
    );
  }

  iniciarPartida(partidaID: number, usuarioID: number) {
    console.log(`Iniciando partida ${partidaID} por el usuario ${usuarioID}...`);

    const url = `${this.partidasURL}/${partidaID}/${usuarioID}/iniciarPartida`;

    return this.http.put(url, {}).pipe(
      tap(() => {
        console.log(`Partida ${partidaID} iniciada por el usuario ${usuarioID}.`);
      })
    );
  }
}
