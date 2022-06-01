import { TestBed } from '@angular/core/testing';

import { DailyPositionSheetService } from './daily-position-sheet.service';

describe('DailyPositionSheetService', () => {
  let service: DailyPositionSheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyPositionSheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
