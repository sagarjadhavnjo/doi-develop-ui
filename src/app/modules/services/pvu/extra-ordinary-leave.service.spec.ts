import { TestBed } from '@angular/core/testing';

import { ExtraOrdinaryLeaveService } from './extra-ordinary-leave.service';

describe('ExtraOrdinaryLeaveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExtraOrdinaryLeaveService = TestBed.get(ExtraOrdinaryLeaveService);
    expect(service).toBeTruthy();
  });
});
