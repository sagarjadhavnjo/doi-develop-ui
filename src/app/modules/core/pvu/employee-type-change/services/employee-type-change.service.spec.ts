import { TestBed } from '@angular/core/testing';

import { EmployeeTypeChangeService } from './employee-type-change.service';

describe('EmployeeTypeChangeService', () => {
  let service: EmployeeTypeChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeTypeChangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
