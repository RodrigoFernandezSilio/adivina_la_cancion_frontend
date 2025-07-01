import { CommonModule, NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Cancion } from '../../cancion';
import { PartidaPreview } from '../../partida';
import { RespuestaDTO } from '../../respuesta';
import { RondaDTO } from '../../ronda';
import { UsuarioSanitizado } from '../../usuario';
import { WebsocketService } from '../../websocket.service';

@Component({
  selector: 'app-partida-iniciada',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './partida-iniciada.component.html',
  styleUrl: './partida-iniciada.component.css'
})

export class PartidaIniciadaComponent {
  @Input() partida!: PartidaPreview;
  usuarios: UsuarioSanitizado[] = []
  @Input() rondasDTO!: RondaDTO[];
  @Input() rondaFinalizada!: boolean
  cancionesSeleccionadas: (Cancion | null)[] = Array(20).fill(null); // Lista de la canción seleccionada de cada ronda
  @Input() listaCancionesCorrectas!: Cancion[] // Lista de la canción correcta de cada ronda
  @Input() listaRespuestasDTO!: RespuestaDTO[][];

  constructor(private websocketService: WebsocketService) { }

  ngOnInit() {
    this.usuarios = this.partida.usuarios;
  }


  // Devuelve la última ronda de la lista o null si está vacía
  get rondaActual(): RondaDTO | null {
    if (this.rondasDTO.length > 0) {
      return this.rondasDTO[this.rondasDTO.length - 1];
    } else {
      return null;
    }
  }

  get numRondaActual(): number {
    return this.rondasDTO.length
  }


  /**
   * Permite seleccionar una canción para la ronda actual solo si aún no se ha seleccionado ninguna.
   * 
   * @param cancion La canción seleccionada para enviar.
   */
  seleccionarCancion(cancion: Cancion) {

    // Comprobar si no se ha seleccionado una canción para la ronda actual
    // if (this.cancionesSeleccionadas[this.numRondaActual - 1] == null) {

    // Registrar la cancion seleccionada
    this.cancionesSeleccionadas[this.numRondaActual - 1] = cancion

    // Enviar la canción seleccionada al backend mediante el servicio WebSocket
    this.websocketService.enviarObjeto("Cancion", cancion);
  }

  /**
   * Verifica si es posible seleccionar una canción para la ronda actual.
   * 
   *  @returns true si no se ha seleccionado ninguna canción para la ronda actual, false en caso contrario.
   */
  seleccionarCancionDisponible(): boolean {
    return this.cancionesSeleccionadas[this.numRondaActual - 1] == null;
  }


  /**
   * Devuelve true si la canción es correcta.
   * La canción es correcta si la ronda ha finalizado y coincide con la canción correcta de la ronda actual.
   * 
   * @param {any} cancion - La canción que se desea verificar.
   * @returns {boolean} true si la canción es correcta, false en caso contrario.
   */
  esCancionCorrecta(cancion: any): boolean {
    if (this.rondaFinalizada) {
      const cancionCorrecta = this.listaCancionesCorrectas[this.numRondaActual - 1]!;
      if (cancion.id === cancionCorrecta.id) {
        return true;
      }
    }
    return false;
  }

  /**
   * Devuelve true si la canción es incorrecta.
   * La canción es incorrecta si la ronda ha finalizado, fue seleccionada y no coincide con la canción correcta de la ronda actual.
   *
   * @param {any} cancion - La canción que se desea verificar.
   * @returns {boolean} true si la canción es incorrecta, false en caso contrario.
   */
  esCancionIncorrecta(cancion: any): boolean {
    if (this.rondaFinalizada) {
      const cancionSeleccionada = this.cancionesSeleccionadas[this.numRondaActual - 1]!
      const cancionCorrecta = this.listaCancionesCorrectas[this.numRondaActual - 1]
      if (cancionSeleccionada != null && cancion.id === cancionSeleccionada.id && cancion.id !== cancionCorrecta.id) {
        return true;
      }
    }
    return false;
  }


  getPuntuacionesUsuario(indUsuario: number): string {
    // Verifica que haya respuestas en el índice dado
    if (!this.listaRespuestasDTO[indUsuario] || this.listaRespuestasDTO[indUsuario].length === 0) {
      return ''; // Retorna una cadena vacía si no hay respuestas
    }

    // Extrae las puntuaciones
    const puntuaciones = this.listaRespuestasDTO[indUsuario].map(respuesta => respuesta.puntuacion);

    // Calcula la suma total
    const total = puntuaciones.reduce((acc, val) => acc + val, 0);

    // Si la ronda no ha finalizado, simplemente se muestra el total acumulado hasta el momento.
    // En cambio, si la ronda ha finalizado, se muestra una fórmula que descompone el total como:
    // "total anterior + última puntuación = total final"
    // Esto permite visualizar cuánto aportó la última respuesta al total.
    if (!this.rondaFinalizada) {
      return `${total}`;
    } else {
      const ultimaPuntuacion = puntuaciones[puntuaciones.length - 1] || 0;
      const totalAnterior = total - ultimaPuntuacion;
      return `${totalAnterior} + ${ultimaPuntuacion} = ${total}`;
    }
  }
}
