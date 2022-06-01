import { TestBed } from '@angular/core/testing';

import { FixToRegularListService } from './fix-to-regular-list.service';

describe('FixToRegularListService', () => {
  let service: FixToRegularListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixToRegularListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
