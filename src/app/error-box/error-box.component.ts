import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ErrorBoxService } from '../error-box.service';

export interface mensajeError {
  mensaje: string;
  timestamp: Date;
}

@Component({
  selector: 'app-error-box',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './error-box.component.html',
  styleUrl: './error-box.component.css'
})
export class ErrorBoxComponent {
  constructor(public errorBoxService: ErrorBoxService) {}
}
