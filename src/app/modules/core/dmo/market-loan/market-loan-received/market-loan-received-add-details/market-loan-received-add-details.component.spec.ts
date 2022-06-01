import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketLoanReceivedAddDetailsComponent } from './market-loan-received-add-details.component';

describe('MarketLoanReceivedAddDetailsComponent', () => {
  let component: MarketLoanReceivedAddDetailsComponent;
  let fixture: ComponentFixture<MarketLoanReceivedAddDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketLoanReceivedAddDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketLoanReceivedAddDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
