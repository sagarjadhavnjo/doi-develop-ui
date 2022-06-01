import { TestBed } from '@angular/core/testing';

import { RightsMappingService } from './right-mapping.service';

describe('EdpRoleMappingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RightsMappingService = TestBed.get(RightsMappingService);
    expect(service).toBeTruthy();
  });
});
