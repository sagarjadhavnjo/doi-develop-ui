import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoInsuranceClaimViewComponent } from './co-insurance-claim-view.component';

describe('CoInsuranceClaimViewComponent', () => {
  let component: CoInsuranceClaimViewComponent;
  let fixture: ComponentFixture<CoInsuranceClaimViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoInsuranceClaimViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoInsuranceClaimViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
