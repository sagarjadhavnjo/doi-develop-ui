import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketLoanRepaymentRbiComponent } from './market-loan-repayment-rbi.component';

describe('MarketLoanRepaymentRbiComponent', () => {
  let component: MarketLoanRepaymentRbiComponent;
  let fixture: ComponentFixture<MarketLoanRepaymentRbiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketLoanRepaymentRbiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketLoanRepaymentRbiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
