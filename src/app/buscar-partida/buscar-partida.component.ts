import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PartidaService } from '../partida.service';
import { UsuarioService } from '../usuario.service';
import { Partida, PartidaPreview } from '../partida';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-buscar-partida',
  standalone: true,
  imports: [NgFor],
  templateUrl: './buscar-partida.component.html',
  styleUrl: './buscar-partida.component.css'
})
export class BuscarPartidaComponent {

  partidas: PartidaPreview[] = [];

  constructor(private router: Router, private partidaService: PartidaService, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.partidaService.obtenerPartidas().subscribe(partidas => {
      // Ordenar las partidas de forma que se priorice aquellas que están más próximas a completarse
      this.partidas = partidas.sort((a, b) => {
        const diffA = a.numMaxUsuariosPartida - a.usuarios.length;
        const diffB = b.numMaxUsuariosPartida - b.usuarios.length;
        return diffA - diffB;
      });
    });
  }  

  anhadirUsuarioAux(partida: PartidaPreview) {
    this.partidaService.anhadirUsuarioAux(partida, this.usuarioService.usuario!.id).subscribe(() => {
      this.router.navigate([`/partida/${partida.id}`]);
    });
  }

  volverAlMenu() {
    this.router.navigate(['/menu-principal']);
  }
}
