import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCategoriesMenuComponent } from './all-categories-menu.component';

describe('AllCategoriesMenuComponent', () => {
  let component: AllCategoriesMenuComponent;
  let fixture: ComponentFixture<AllCategoriesMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCategoriesMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCategoriesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
