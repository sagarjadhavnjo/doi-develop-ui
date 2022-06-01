import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoInsuranceMemorandumComponent } from './co-insurance-memorandum.component';

describe('CoInsuranceMemorandumComponent', () => {
  let component: CoInsuranceMemorandumComponent;
  let fixture: ComponentFixture<CoInsuranceMemorandumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoInsuranceMemorandumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoInsuranceMemorandumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
