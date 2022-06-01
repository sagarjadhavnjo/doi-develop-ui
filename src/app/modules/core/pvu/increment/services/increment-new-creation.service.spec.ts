import { TestBed } from '@angular/core/testing';

import { IncrementNewCreationService } from './increment-new-creation.service';

describe('IncrementNewCreationService', () => {
  let service: IncrementNewCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncrementNewCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
