import { TestBed } from '@angular/core/testing';

import { FixToRegularService } from './fix-to-regular.service';

describe('FixToRegularService', () => {
  let service: FixToRegularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixToRegularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
