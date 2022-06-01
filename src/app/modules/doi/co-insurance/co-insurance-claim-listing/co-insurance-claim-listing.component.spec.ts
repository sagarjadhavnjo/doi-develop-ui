import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoInsuranceClaimListingComponent } from './co-insurance-claim-listing.component';

describe('CoInsuranceClaimListingComponent', () => {
  let component: CoInsuranceClaimListingComponent;
  let fixture: ComponentFixture<CoInsuranceClaimListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoInsuranceClaimListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoInsuranceClaimListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
