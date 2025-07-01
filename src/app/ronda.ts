import { Cancion } from "./cancion";

export interface RondaDTO {
    id: number;
    canciones: Cancion[];
    cancionCorrectaAudioURL: string;
}