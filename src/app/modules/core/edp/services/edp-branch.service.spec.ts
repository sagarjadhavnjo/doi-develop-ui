import { TestBed } from '@angular/core/testing';

import { EdpBranchService } from './edp-branch.service';

describe('EdpBranchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EdpBranchService = TestBed.get(EdpBranchService);
    expect(service).toBeTruthy();
  });
});
