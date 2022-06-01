import { TestBed } from '@angular/core/testing';

import { IncrementListService } from './increment-list.service';

describe('IncrementListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IncrementListService = TestBed.get(IncrementListService);
    expect(service).toBeTruthy();
  });
});
