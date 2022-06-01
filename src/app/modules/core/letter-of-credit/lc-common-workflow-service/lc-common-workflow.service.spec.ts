import { TestBed } from '@angular/core/testing';

import { LcCommonWorkflowService } from './lc-common-workflow.service';

describe('LcCommonWorkflowService', () => {
  let service: LcCommonWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LcCommonWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
