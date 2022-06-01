import { TestBed } from '@angular/core/testing';

import { PVUWorkflowService } from './pvu-workflow.service';

describe('PVUWorkflowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PVUWorkflowService = TestBed.get(PVUWorkflowService);
    expect(service).toBeTruthy();
  });
});
