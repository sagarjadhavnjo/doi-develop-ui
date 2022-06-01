import { TestBed } from '@angular/core/testing';

import { HbaService } from './hba.service';

describe('HbaService', () => {
  let service: HbaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HbaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
