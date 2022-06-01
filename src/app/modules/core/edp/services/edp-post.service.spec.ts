import { TestBed } from '@angular/core/testing';

import { EdpPostService } from './edp-post.service';

describe('EdpPostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EdpPostService = TestBed.get(EdpPostService);
    expect(service).toBeTruthy();
  });
});
