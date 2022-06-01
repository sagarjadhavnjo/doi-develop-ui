import { TestBed } from '@angular/core/testing';

import { BulkEmpCreationService } from './bulk-emp-creation.service';

describe('BulkEmpCreationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BulkEmpCreationService = TestBed.get(BulkEmpCreationService);
    expect(service).toBeTruthy();
  });
});
