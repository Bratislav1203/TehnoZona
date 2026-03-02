import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoNavigacijaComponent } from './demo-navigacija.component';

describe('DemoNavigacijaComponent', () => {
  let component: DemoNavigacijaComponent;
  let fixture: ComponentFixture<DemoNavigacijaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoNavigacijaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoNavigacijaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
