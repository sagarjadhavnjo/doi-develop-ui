import { TestBed } from '@angular/core/testing';

import { AddDesignationService } from './add-designation.service';

describe('AddDesignationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddDesignationService = TestBed.get(AddDesignationService);
    expect(service).toBeTruthy();
  });
});
