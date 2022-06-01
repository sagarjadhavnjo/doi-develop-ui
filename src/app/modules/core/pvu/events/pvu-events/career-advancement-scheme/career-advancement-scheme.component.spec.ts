import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerAdvancementSchemeComponent } from './career-advancement-scheme.component';

describe('CareerAdvancementSchemeComponent', () => {
  let component: CareerAdvancementSchemeComponent;
  let fixture: ComponentFixture<CareerAdvancementSchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareerAdvancementSchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareerAdvancementSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
