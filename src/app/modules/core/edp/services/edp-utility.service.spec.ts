import { TestBed } from '@angular/core/testing';

import { EdpUtilityService } from './edp-utility.service';

describe('EdpUtilityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EdpUtilityService = TestBed.get(EdpUtilityService);
    expect(service).toBeTruthy();
  });
});
