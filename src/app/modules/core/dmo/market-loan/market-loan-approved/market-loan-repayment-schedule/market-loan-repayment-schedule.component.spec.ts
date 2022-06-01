import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketLoanRepaymentScheduleComponent } from './market-loan-repayment-schedule.component';

describe('MarketLoanRepaymentScheduleComponent', () => {
  let component: MarketLoanRepaymentScheduleComponent;
  let fixture: ComponentFixture<MarketLoanRepaymentScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketLoanRepaymentScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketLoanRepaymentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
