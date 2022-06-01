import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketLoanReceivedComponent } from './market-loan-received.component';

describe('MarketLoanReceivedComponent', () => {
  let component: MarketLoanReceivedComponent;
  let fixture: ComponentFixture<MarketLoanReceivedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketLoanReceivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketLoanReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
