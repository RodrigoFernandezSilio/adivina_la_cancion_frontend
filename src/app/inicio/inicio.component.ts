import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  formularioUsuario: FormGroup;
  formularioEnviado: boolean = false;

  constructor(private router: Router, private usuarioService: UsuarioService) {
    this.formularioUsuario = new FormGroup({
      nombreUsuario: new FormControl("", [Validators.required])
    })
  }

  onSubmit() {
    this.formularioEnviado = true; // Se marca el formulario como enviado

    this.crearUsuario();
  }

  crearUsuario() {
    if (this.formularioUsuario.invalid) {
      return; // Si el formulario no es válido, no se ejecuta la lógica
    }

    const nombreUsuario = this.formularioUsuario.get('nombreUsuario')?.value;

    console.log("Creando usuario...");
    this.usuarioService.crearUsuario(nombreUsuario).subscribe({
      next: () => {
        console.log(`Usuario creado`);
        this.router.navigate(['/menu-principal']); // Redirige a /menu-principal solo si fue exitoso
      },
      error: (error) => {
        console.error("Error al crear usuario:", error);
      }
    });
  }
}
