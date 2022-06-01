import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NssfLoanRepaymentComponent } from './nssf-loan-repayment.component';

describe('NssfLoanRepaymentComponent', () => {
  let component: NssfLoanRepaymentComponent;
  let fixture: ComponentFixture<NssfLoanRepaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NssfLoanRepaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NssfLoanRepaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
