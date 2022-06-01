import { TestBed } from '@angular/core/testing';

import { PostTransferService } from './post-transfer.service';

describe('PostTransferService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostTransferService = TestBed.get(PostTransferService);
    expect(service).toBeTruthy();
  });
});
