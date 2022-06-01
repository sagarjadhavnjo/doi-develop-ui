import { TestBed } from '@angular/core/testing';

import { EdpDdoOfficeService } from './edp-ddo-office.service';

describe('EdpDdoOfficeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EdpDdoOfficeService = TestBed.get(EdpDdoOfficeService);
    expect(service).toBeTruthy();
  });
});
