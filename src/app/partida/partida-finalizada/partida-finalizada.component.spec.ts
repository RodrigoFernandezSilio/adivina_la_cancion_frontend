import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidaFinalizadaComponent } from './partida-finalizada.component';

describe('PartidaFinalizadaComponent', () => {
  let component: PartidaFinalizadaComponent;
  let fixture: ComponentFixture<PartidaFinalizadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartidaFinalizadaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartidaFinalizadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
