import { TestBed } from '@angular/core/testing';

import { IncrementCreationService } from './increment-creation.service';

describe('IncrementCreationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IncrementCreationService = TestBed.get(IncrementCreationService);
    expect(service).toBeTruthy();
  });
});
