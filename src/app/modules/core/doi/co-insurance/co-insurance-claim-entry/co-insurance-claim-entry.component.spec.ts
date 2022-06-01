import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoInsuranceClaimEntryComponent } from './co-insurance-claim-entry.component';

describe('CoInsuranceClaimEntryComponent', () => {
  let component: CoInsuranceClaimEntryComponent;
  let fixture: ComponentFixture<CoInsuranceClaimEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoInsuranceClaimEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoInsuranceClaimEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
