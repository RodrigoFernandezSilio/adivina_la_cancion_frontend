import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnirsePartidaPrivadaComponent } from './unirse-partida-privada.component';

describe('UnirsePartidaPrivadaComponent', () => {
  let component: UnirsePartidaPrivadaComponent;
  let fixture: ComponentFixture<UnirsePartidaPrivadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnirsePartidaPrivadaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnirsePartidaPrivadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
