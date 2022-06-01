import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketLoanRepaymentTreasuryComponent } from './market-loan-repayment-treasury.component';

describe('MarketLoanRepaymentTreasuryComponent', () => {
  let component: MarketLoanRepaymentTreasuryComponent;
  let fixture: ComponentFixture<MarketLoanRepaymentTreasuryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketLoanRepaymentTreasuryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketLoanRepaymentTreasuryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
