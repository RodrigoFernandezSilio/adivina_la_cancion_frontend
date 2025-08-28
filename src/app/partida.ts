import { Cancion } from "./cancion";
import { Usuario, UsuarioSanitizado } from "./usuario";

export const NUM_MAX_USUARIOS = 10;
export const NUM_MAX_RONDAS = 20;

export interface Partida {
    id: number;
    estado: EstadoPartida;
    usuarios: Usuario[];
    numRondas: number;
    numMaxUsuariosPartida: number;
    votoModificable: boolean;
    rondas: Ronda[];
    playlist: Playlist;
    privada: boolean;
    codigoAcceso: string;
}

export enum EstadoPartida {
	NO_INICIADA,
    INICIADA,
    FINALIZADA
}

interface Ronda {
    id: number;
    canciones: Cancion[];
    cancionCorrecta: Cancion;
}

interface Playlist {
    id: number;
    nombre: string;
}

export enum ModoPuntuacion {
  FIJO = 'FIJO',
  PROGRESIVO = 'PROGRESIVO'
}


export interface PartidaDTO {
    playlistID: string;
    numMaxUsuariosPartida: number;
    numRondas: number;
    votoModificable: boolean;
    modoPuntuacion: ModoPuntuacion;
    privada: boolean;
    codigoAcceso?: string;
    usuarioID: number;
}

export interface PartidaPreview {
    id: number;
    listaReproduccionNombre: string;
    numRondas: number;
    numMaxUsuariosPartida: number;
    votoModificable: boolean;
    modoPuntuacion: ModoPuntuacion;
    usuarios: UsuarioSanitizado[];
}