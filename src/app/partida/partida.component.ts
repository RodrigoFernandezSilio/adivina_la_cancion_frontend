import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cancion } from '../cancion';
import { EstadoPartida, PartidaPreview } from '../partida';
import { PartidaService } from '../partida.service';
import { RespuestaDTO } from '../respuesta';
import { RondaDTO } from '../ronda';
import { UsuarioService } from '../usuario.service';
import { WebsocketService } from '../websocket.service';
import { PartidaFinalizadaComponent } from './partida-finalizada/partida-finalizada.component';
import { PartidaIniciadaComponent } from './partida-iniciada/partida-iniciada.component';
import { PartidaNoIniciadaComponent } from './partida-no-iniciada/partida-no-iniciada.component';

@Component({
  selector: 'app-partida',
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule, NgIf, PartidaNoIniciadaComponent, PartidaIniciadaComponent, PartidaFinalizadaComponent],
  templateUrl: './partida.component.html',
  styleUrls: ['./partida.component.css']
})

export class PartidaComponent implements OnDestroy {
  partida: PartidaPreview = this.partidaService.partida!
  estadoPartida: EstadoPartida = EstadoPartida.NO_INICIADA;
  EstadoPartida = EstadoPartida;
  partidaID!: number; // "!" indica que esta propiedad sera asignada mas tarde
  usuarioID!: number
  mensajes: any[] = [];
  mensajeEnviado: string = ''; // Mensaje que el usuario está escribiendo

  rondaFinalizada: boolean = false;
  rondasDTO: RondaDTO[] = []; // Lista de rondas
  listaCancionesCorrectas: Cancion[] = [] // Lista de la canción correcta de cada ronda
  listaRespuestasDTO: RespuestaDTO[][] = [];


  constructor(private router: Router, private route: ActivatedRoute, private websocketService: WebsocketService,
    private usuarioService: UsuarioService, private partidaService: PartidaService) {
    // Obtén el ID de la partida desde la URL
    this.route.params.subscribe(params => {
      this.partidaID = +params['id'];  // Convierte a número
      this.usuarioID = this.usuarioService.usuario!.id
      this.websocketService.connect(this.partidaID, this.usuarioID);  // Conéctate a WebSocket para la partida

      // Suscríbete a los mensajes que llegan por WebSocket
      this.websocketService.getMessages().subscribe(message => {
        this.mensajes.push(message);  // Maneja los mensajes recibidos
      });

      this.websocketService.getUsuariosSanitizados().subscribe(usuariosSanitizados => {
        this.partida.usuarios = usuariosSanitizados;
      });

      this.websocketService.getRondaDTO().subscribe(rondaDTO => {
        this.rondasDTO.push(rondaDTO);
        this.rondaFinalizada = false;

        // Cuando llega la primera ronda
        if (this.rondasDTO.length === 1) {
          // Se cambia el estado a iniciada
          this.estadoPartida = EstadoPartida.INICIADA;
          // Se avisa al usuario si el volumen está a cero o silenciado
          this.mostrarAlertaAudioSilenciado();
        }

        console.log(`Ronda recibida. Está sonando la canción: ${rondaDTO.cancionCorrectaAudioURL}`);
      });

      this.websocketService.getCancion().subscribe(cancion => {
        this.listaCancionesCorrectas = [...this.listaCancionesCorrectas, cancion];
        this.rondaFinalizada = true;
      })

      this.websocketService.getRespuestasDTO().subscribe(respuestasDTO => {
        if (this.listaRespuestasDTO.length === 0) {
          // Inicializa listaRespuestasDTO con sublistas vacías para cada elemento de respuestasDTO
          this.listaRespuestasDTO = respuestasDTO.map((item: any) => [item]);
        } else {
          // Agrega cada elemento de respuestasDTO a su correspondiente sublista
          this.listaRespuestasDTO = this.listaRespuestasDTO.map((subLista: any[], index: number) => [...subLista, respuestasDTO[index]]);
        }

        // Cuando llega la última lista de respuesta
        if (this.listaRespuestasDTO[0].length === this.partida.numRondas) {
          // Se espera 4 segundos y se cambia el estado a finalizada
          setTimeout(() => {
            this.estadoPartida = EstadoPartida.FINALIZADA;
          }, 4000); // 4000 milisegundos = 4 segundos
        }
      });
    });
  }

  @ViewChild('audioRef', { static: false }) audioElement?: ElementRef<HTMLAudioElement>;

  mostrarAlertaAudioSilenciado() {
    setTimeout(() => {
      const audio = this.audioElement?.nativeElement;
      if (!audio) return;

      if (audio.volume === 0 || audio.muted) {
        alert('Tienes el volumen a 0 o el audio está silenciado. Por favor, enciéndelo.');
      }
    });
  }

  // Método para enviar mensajes a través del WebSocket
  enviarMensaje() {
    let mensajeEnviadoSinEspacios = this.mensajeEnviado.trim(); // Elimimar espacios en blanco al inicio y al final
    // Comprobar que el mensaje no este vacio
    if (mensajeEnviadoSinEspacios) {
      this.websocketService.sendMessage({ text: this.mensajeEnviado });
      this.mensajeEnviado = '';  // Limpiar el area de texto despues de enviar el mensaje
    }
    console.log(this.mensajes)
  }

  ngOnDestroy() {
    // Cierra la conexión WebSocket cuando se destruye el componente
    this.websocketService.disconnect();
  }

  volverAlMenu() {
    this.router.navigate(['/menu-principal']);
  }
}