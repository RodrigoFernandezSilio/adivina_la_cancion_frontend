import { Injectable } from '@angular/core';
import { mensajeError } from './error-box/error-box.component';


@Injectable({
  providedIn: 'root'
})

export class ErrorBoxService {
  mensajeErrorLista: mensajeError[] = [];

  agregarError(mensajeError: string): void {
    this.mensajeErrorLista.push({ mensaje: mensajeError, timestamp: new Date() });
  }

  obtenerErrores(): mensajeError[] {
    return this.mensajeErrorLista;
  }

  limpiarErrores() {
    this.mensajeErrorLista = []
  }
}
