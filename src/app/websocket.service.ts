import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { RondaDTO } from './ronda';
import { UsuarioSanitizado } from './usuario';
import { RespuestaDTO } from './respuesta';
import { Cancion } from './cancion';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: WebSocket | null = null;  // Inicializa como null
  private messages: Subject<any> = new Subject<any>();  // Subject para emitir mensajes

  private usuariosSanitizadosSubject = new Subject<UsuarioSanitizado[]>(); // Subject para emitir listas de usuarios

  private rondaDTOSubject = new Subject<RondaDTO>();  // Subject para emitir rondas

  private cancionSubject = new Subject<Cancion>(); // Subject para emitir canciones

  private respuestasDTOSubject = new Subject<RespuestaDTO[]>(); // Subject para emitir resultados


  constructor() {}

  connect(partidaID: number, usuarioID: number): void {
    // Cambia esta URL a la URL de tu servidor de WebSocket
    const url = `ws://localhost:8080/webSocketPartida/${partidaID}/${usuarioID}`;

    // Crea una nueva conexión WebSocket
    this.socket = new WebSocket(url);

    // Cuando se recibe un mensaje del servidor, lo emitimos a través del Subject
    // this.socket.onmessage = (event) => {
    //   this.messages.next(JSON.parse(event.data));
    // };
    this.socket.onmessage = (event) => {
      this.handleMessage(event);  // Procesamos los mensajes recibidos
    };

    // También puedes manejar eventos de error y cierre
    this.socket.onerror = (event) => {
      console.error("Error en la conexión WebSocket", event);
    };
  }

  // Método para procesar los mensajes recibidos
  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);

      if (Array.isArray(data) && data.length === 2) {
        const [className, payload] = data;

        // Aquí procesamos según el tipo de clase
        if (className === 'adivina_la_cancion.prototipo.adivina_la_cancion.dto.RondaDTO') {
          this.rondaDTOSubject.next(payload);  // Emitir la ronda recibida
        }
        else if (className === 'adivina_la_cancion.prototipo.adivina_la_cancion.dto.UsuariosDTO') {
          this.usuariosSanitizadosSubject.next(payload.usuarios);
        }
        else if (className === 'adivina_la_cancion.prototipo.adivina_la_cancion.domain.Cancion') {
          this.cancionSubject.next(payload);
        }
        else if (className === 'adivina_la_cancion.prototipo.adivina_la_cancion.dto.ListaRespuestaDTO') {
          this.respuestasDTOSubject.next(payload.respuestasDTO);
        }
      } else {
        console.warn('Formato inesperado de mensaje recibido:', data);
      }
    } catch (error) {
      console.error('Error al procesar el mensaje WebSocket:', error);
    }
  }

  getUsuariosSanitizados(): Observable<UsuarioSanitizado[]> {
    return this.usuariosSanitizadosSubject.asObservable(); // Devolver el observable del Subject
  }

  getRondaDTO(): Observable<RondaDTO> {
    return this.rondaDTOSubject.asObservable();  // Devolver el observable del Subject
  }

  getCancion(): Observable<Cancion> {
    return this.cancionSubject.asObservable(); // Devolver el observable del Subject
  }

  getRespuestasDTO(): Observable<RespuestaDTO[]> {
    return this.respuestasDTOSubject.asObservable(); // Devolver el observable del Subject
  }

  // Método para enviar el objeto serializado al servidor WebSocket
  enviarObjeto(nombreClase: string, objeto: any): void {
    const mensaje = [nombreClase, objeto]
    const mensaje_json = JSON.stringify(mensaje) // Serializar el mensaje a formato JSON
    this.enviarMensaje(mensaje_json)
  }

  // Método para enviar un mensaje al servidor WebSocket
  private enviarMensaje(mensaje: string) {
    // Verificar si el WebSocket está abierto y listo para enviar el mensaje
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(mensaje);
    }
  }

  // Método para enviar un mensaje al servidor WebSocket
  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {

      // this.socket.send(JSON.stringify(message));
    }
  }

  // Obtener los mensajes recibidos del servidor
  getMessages() {
    return this.messages.asObservable();  // Retorna el Subject como un Observable
  }

  // Cerrar la conexión WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
