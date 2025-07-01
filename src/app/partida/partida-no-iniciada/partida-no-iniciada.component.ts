import { Component, Input } from '@angular/core';
import { PartidaPreview } from '../../partida';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-partida-no-iniciada',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './partida-no-iniciada.component.html',
  styleUrl: './partida-no-iniciada.component.css'
})
export class PartidaNoIniciadaComponent {
    @Input() partida!: PartidaPreview;
}
