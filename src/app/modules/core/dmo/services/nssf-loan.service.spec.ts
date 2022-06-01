import { TestBed } from '@angular/core/testing';

import { NssfLoanService } from './nssf-loan.service';

describe('NssfLoanService', () => {
  let service: NssfLoanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NssfLoanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
