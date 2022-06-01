import { TestBed } from '@angular/core/testing';

import { IncrementNewListService } from './increment-new-list.service';

describe('IncrementNewListService', () => {
  let service: IncrementNewListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncrementNewListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
