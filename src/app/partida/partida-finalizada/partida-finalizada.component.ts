import { Component, Input } from '@angular/core';
import { RespuestaDTO } from '../../respuesta';
import { UsuarioSanitizado } from '../../usuario';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-partida-finalizada',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './partida-finalizada.component.html',
  styleUrl: './partida-finalizada.component.css'
})
export class PartidaFinalizadaComponent {
  @Input() usuarios!: UsuarioSanitizado[];
  @Input() listaRespuestasDTO!: RespuestaDTO[][];

  getUsuariosOrdenadosPorPuntuacion(): {usuario: UsuarioSanitizado, puntuacionFinal: string, total: number}[] {
    return this.usuarios
      .map((usuario, index) => ({
        usuario,
        total: (this.listaRespuestasDTO[index] || []).reduce((acc, r) => acc + r.puntuacion, 0),
        puntuacionFinal: this.getPuntuacionFinalUsuario(index)
      }))
      .sort((a, b) => b.total - a.total);
  }

  getPuntuacionFinalUsuario(indUsuario: number): string {
    // Verifica que haya respuestas en el índice dado
    if (!this.listaRespuestasDTO[indUsuario] || this.listaRespuestasDTO[indUsuario].length === 0) {
      return ''; // Retorna una cadena vacía si no hay respuestas
    }

    // Extrae las puntuaciones
    const puntuaciones = this.listaRespuestasDTO[indUsuario].map(respuesta => respuesta.puntuacion);

    // Calcula la suma total
    const total = puntuaciones.reduce((acc, val) => acc + val, 0);

    // Formatea cada puntuación con 3 caracteres, alineadas a la derecha con espacios
    const puntuacionesFormateadas = puntuaciones
      .map(p => p.toString().padStart(2, ' '))
      .join(' + ');

    return `${puntuacionesFormateadas} = ${total}`;
  }
}



