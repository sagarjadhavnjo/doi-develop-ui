import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReInsurancePolicyMasterComponent } from './re-insurance-policy-master.component';

describe('ReInsurancePolicyMasterComponent', () => {
  let component: ReInsurancePolicyMasterComponent;
  let fixture: ComponentFixture<ReInsurancePolicyMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReInsurancePolicyMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReInsurancePolicyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
