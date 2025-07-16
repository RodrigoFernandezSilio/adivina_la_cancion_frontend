import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MusicaService } from '../musica.service';
import { ModoPuntuacion, NUM_MAX_RONDAS, NUM_MAX_USUARIOS } from '../partida';
import { PartidaService } from '../partida.service';
import { Playlist } from '../playlist';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-crear-partida',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, ReactiveFormsModule],
  templateUrl: './crear-partida.component.html',
  styleUrl: './crear-partida.component.css'
})
export class CrearPartidaComponent {
  NUM_MAX_RONDAS = NUM_MAX_RONDAS; // Asignamos la constante a una propiedad de la clase
  NUM_MAX_USUARIOS = NUM_MAX_USUARIOS; // Asignamos la constante a una propiedad de la clase

  playlists: Playlist[] = [];

  playlistSeleccionada: Playlist | null = null;

  dropdownOpen: boolean = false;

  modosPuntuacion = Object.values(ModoPuntuacion);
  modoPuntuacionSeleccionado: ModoPuntuacion | null = null;
  dropdownOpenModoPuntuacion: boolean = false;

  // Se usa ! para decirle a TypeScript que esta propiedad se va a inicializar antes de usarse
  formularioCrearPartida!: FormGroup;
  formularioEnviado: boolean = false;

  constructor(private router: Router, private fb: FormBuilder,
    private partidaService: PartidaService, private usuarioService: UsuarioService, private musicaService: MusicaService) { }

  ngOnInit() {

    this.formularioCrearPartida = this.fb.group({
      playlistID: ["", [Validators.required]],
      numRondas: [10, [Validators.required, Validators.min(1), Validators.max(this.NUM_MAX_RONDAS)]],
      numMaxUsuariosPartida: [5, [Validators.required, Validators.min(1), Validators.max(this.NUM_MAX_USUARIOS)]],
      votoModificable: [true],
      modoPuntuacion: [null, [Validators.required]],
      privada: [false],
      codigoAcceso: [{ value: '', disabled: true }, [this.codigoAccesoRequiredValidator]],
      usuarioID: [this.usuarioService.usuario!.id]
    })

    // Validar el campo codigoAcceso cuando cambia el valor del campo privada
    this.formularioCrearPartida.get('privada')?.valueChanges.subscribe(() => {
      this.formularioCrearPartida.get('codigoAcceso')?.updateValueAndValidity();
    });

    // Gestionar la habilitación y valor de 'codigoAcceso' según el estado del checkbox 'privada'
    this.formularioCrearPartida.get('privada')?.valueChanges.subscribe(value => {
      if (value) { // Cuando el checkbox 'privada' se marca
        this.formularioCrearPartida.get('codigoAcceso')?.enable(); // Se habilita 'codigoAcceso'
      } else { // Cuando el checkbox 'privada' se desmarca
        this.formularioCrearPartida.get('codigoAcceso')?.setValue(""); // Se limpia el valor de 'codigoAcceso'
        this.formularioCrearPartida.get('codigoAcceso')?.disable(); // Se deshabilita 'codigoAcceso"
      }
    });
  }


  /**
   * Validador personalizado que hace obligatorio el campo 'codigoAcceso'
   * solo si la opción 'privada' está activada.
   */
  codigoAccesoRequiredValidator(formControl: AbstractControl) {
    if (!formControl.parent) {
      return null;
    }

    if (formControl.parent.get('privada')!.value) {
      return Validators.required(formControl);
    }
    return null;
  }


  toggleDropdown() {
    console.log(!this.dropdownOpen)
    this.dropdownOpen = !this.dropdownOpen;
  }


  buscarPlaylistPorNombre(playlistNombre: string) {
    this.musicaService.buscarPlaylists(playlistNombre, true).subscribe(playlists => {
      this.playlists = playlists;
    })
  }

  seleccionarPlaylist(playlist: Playlist) {
    this.formularioCrearPartida.get('playlistID')?.setValue(playlist.id);
    this.playlistSeleccionada = playlist;
    this.dropdownOpen = false;
  }

  seleccionarModoPuntuacion(modoPuntuacion: ModoPuntuacion) {
    console.log('Seleccionado modo de puntuación...')
    this.formularioCrearPartida.get('modoPuntuacion')?.setValue(modoPuntuacion);
    this.modoPuntuacionSeleccionado = modoPuntuacion;
    this.dropdownOpenModoPuntuacion = false;
  }

  crearPartida() {
    if (this.formularioCrearPartida.invalid) {
      console.warn('Formulario no válido')
      console.log(this.formularioCrearPartida)
      return; // Si el formulario no es válido, no se ejecuta la lógica
    }

    this.partidaService.crearPartida(this.formularioCrearPartida.value).subscribe(partida => {
      this.router.navigate([`/partida/${partida.id}`]);
    });
  }

  onSubmit() {
    this.formularioEnviado = true; // Se marca el formulario como enviado

    this.crearPartida();
  }

  volverAlMenu() {
    this.router.navigate(['/menu-principal']);
  }
}
