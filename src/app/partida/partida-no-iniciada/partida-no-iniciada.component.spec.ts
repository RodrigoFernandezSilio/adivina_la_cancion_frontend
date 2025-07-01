import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidaNoIniciadaComponent } from './partida-no-iniciada.component';

describe('PartidaNoIniciadaComponent', () => {
  let component: PartidaNoIniciadaComponent;
  let fixture: ComponentFixture<PartidaNoIniciadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartidaNoIniciadaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartidaNoIniciadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
