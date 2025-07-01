import { Cancion } from "./cancion";

export interface Playlist {
    id: string;
    nombre: string;
    imagenUrl: string;
    canciones: Cancion[];
}