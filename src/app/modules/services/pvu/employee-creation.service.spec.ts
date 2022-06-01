import { TestBed } from '@angular/core/testing';

import { EmployeeCreationService } from './employee-creation.service';

describe('EmployeeCreationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmployeeCreationService = TestBed.get(EmployeeCreationService);
    expect(service).toBeTruthy();
  });
});
