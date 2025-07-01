import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioComponent } from './inicio.component';
import { UsuarioService } from '../usuario.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('InicioComponent', () => {
  let component: InicioComponent;
  let fixture: ComponentFixture<InicioComponent>;

  let usuarioServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    // Mocks
    usuarioServiceMock = {
      crearUsuario: jasmine.createSpy('crearUsuario').and.returnValue(of({}))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [InicioComponent],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Prueba 1: Éxito - Identificar usuario correctamente', () => {
    // Simula que el usuario escribe un nombre
    component.formularioUsuario.setValue({ nombreUsuario: 'Juan' });

    // Simula que el usuario pulsa “Continuar”
    component.onSubmit();

    // Verifica que se llamó al servicio con el nombre correcto
    expect(usuarioServiceMock.crearUsuario).toHaveBeenCalledWith('Juan');

    // Verifica que se redirige al menú principal
    expect(routerMock.navigate).toHaveBeenCalledWith(['/menu-principal']);
  });

  it('Prueba 2. Campos en blanco', () => {
    // Simula que el usuario no llena el campo
    component.formularioUsuario.setValue({ nombreUsuario: '' });

    // Simula que el usuario intenta continuar
    component.onSubmit();

    fixture.detectChanges();

    // Verifica que el mensaje de error esté presente
    const nombreUsuarioVacio = fixture.nativeElement.querySelector('#nombreUsuarioVacio');
    expect(nombreUsuarioVacio).toBeTruthy();  // El mensaje debe existir en el DOM

    // Verifica que NO se llama al servicio
    expect(usuarioServiceMock.crearUsuario).not.toHaveBeenCalled();
  });

});
