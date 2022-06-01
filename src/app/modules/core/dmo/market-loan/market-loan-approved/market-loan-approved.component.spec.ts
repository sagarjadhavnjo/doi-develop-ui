import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketLoanApprovedComponent } from './market-loan-approved.component';

describe('MarketLoanApprovedComponent', () => {
  let component: MarketLoanApprovedComponent;
  let fixture: ComponentFixture<MarketLoanApprovedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketLoanApprovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketLoanApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
