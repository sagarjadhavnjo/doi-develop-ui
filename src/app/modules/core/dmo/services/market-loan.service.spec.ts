import { TestBed } from '@angular/core/testing';

import { MarketLoanService } from './market-loan.service';

describe('MarketLoanService', () => {
  let service: MarketLoanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketLoanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
