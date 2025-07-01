import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PartidaService } from '../partida.service';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-unirse-partida-privada',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf],
  templateUrl: './unirse-partida-privada.component.html',
  styleUrl: './unirse-partida-privada.component.css'
})
export class UnirsePartidaPrivadaComponent {

  // Se usa ! para decirle a TypeScript que esta propiedad se va a inicializar antes de usarse
  formularioUnirsePartidaPrivada!: FormGroup;
  formularioEnviado: boolean = false;


  constructor(private router: Router, private fb: FormBuilder,
    private partidaService: PartidaService, private usuarioService: UsuarioService) { }


  ngOnInit() {
    this.formularioUnirsePartidaPrivada = this.fb.group({
      partidaId: [null, [Validators.required, Validators.min(1)]],
      partidaCodigoAcceso: ['', [Validators.required]]
    });
  }


  anhadirUsuario() {
    if (this.formularioUnirsePartidaPrivada.invalid) {
      return; // Si el formulario no es válido, no se ejecuta la lógica
    }

    const partidaId = Number(this.formularioUnirsePartidaPrivada.value.partidaId);
    const partidaCodigoAcceso = this.formularioUnirsePartidaPrivada.value.partidaCodigoAcceso;
    const usuarioId = this.usuarioService.usuario!.id;

    this.partidaService.anhadirUsuario(partidaId, usuarioId, partidaCodigoAcceso).subscribe(partidaID => {
      this.router.navigate([`/partida/${partidaId}`]);
    });
  }

  onSubmit() {
    this.formularioEnviado = true; // Se marca el formulario como enviado

    this.anhadirUsuario();
  }

  volverAlMenu() {
    this.router.navigate(['/menu-principal']);
  }
}
