import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumRegisterReInsuranceComponent } from './premium-register-re-insurance.component';

describe('PremiumRegisterReInsuranceComponent', () => {
  let component: PremiumRegisterReInsuranceComponent;
  let fixture: ComponentFixture<PremiumRegisterReInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumRegisterReInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumRegisterReInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
