import { TestBed } from '@angular/core/testing';

import { FieldHistoryService } from './field-history.service';

describe('FieldHistoryService', () => {
  let service: FieldHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
