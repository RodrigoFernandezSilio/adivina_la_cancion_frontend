import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ErrorBoxService } from './error-box.service';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuariosURL = "http://localhost:8080/usuarios"

  usuario: Usuario | null = null;

  constructor(private http: HttpClient, private errorBoxService: ErrorBoxService) { }

  crearUsuario(nombreUsuario: string): Observable<number> {
    console.log("Creando usuario...");

    const url = `${this.usuariosURL}/${nombreUsuario}`;

    return this.http.post<number>(url, null).pipe(
      tap((usuarioID) => {
        this.usuario = {
          id: usuarioID,
          nombre: nombreUsuario,
        };
        console.log(`Usuario creado`);
      }),
      catchError((error) => {
        console.error('Error al crear usuario', error);

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
}