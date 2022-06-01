import { TestBed } from '@angular/core/testing';

import { PvuCommonService } from './pvu-common.service';

describe('PvuCommonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PvuCommonService = TestBed.get(PvuCommonService);
    expect(service).toBeTruthy();
  });
});
