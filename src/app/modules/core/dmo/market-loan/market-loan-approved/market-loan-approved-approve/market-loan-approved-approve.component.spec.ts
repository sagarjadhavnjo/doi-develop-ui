import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketLoanApprovedApproveComponent } from './market-loan-approved-approve.component';

describe('MarketLoanApprovedApproveComponent', () => {
  let component: MarketLoanApprovedApproveComponent;
  let fixture: ComponentFixture<MarketLoanApprovedApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketLoanApprovedApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketLoanApprovedApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
