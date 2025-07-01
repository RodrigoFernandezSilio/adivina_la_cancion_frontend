import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Playlist } from './playlist';

@Injectable({
  providedIn: 'root'
})
export class MusicaService {

  musicaURL = "http://localhost:8080/musica"

  constructor(private http: HttpClient) { }

  buscarPlaylists(q: String, validas: boolean = false): Observable<Playlist[]> {
    const url = `${this.musicaURL}/playlists?q=${q}&validas=${validas}`;

    return this.http.get<Playlist[]>(url).pipe(
      tap(_ => {
        console.log(`Playlists encontradas`)
      })
    )
  }

  obtenerPlaylist(playlistId: string, validas: boolean = false): Observable<Playlist> {
    const url = `${this.musicaURL}/playlists/${playlistId}?validas=${validas}`;

    return this.http.get<Playlist>(url).pipe(
      tap(_ => {
        console.log(`Playlist obtenida`)
      })
    )
  }
}
