import { TestBed } from '@angular/core/testing';

import { PVUEventsService } from './pvu-event.service';

describe('PVUEventsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PVUEventsService = TestBed.get(PVUEventsService);
    expect(service).toBeTruthy();
  });
});
