import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidaIniciadaComponent } from './partida-iniciada.component';

describe('PartidaIniciadaComponent', () => {
  let component: PartidaIniciadaComponent;
  let fixture: ComponentFixture<PartidaIniciadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartidaIniciadaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartidaIniciadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
