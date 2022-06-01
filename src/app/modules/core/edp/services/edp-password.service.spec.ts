import { TestBed } from '@angular/core/testing';

import { EdpPasswordService } from './edp-password.service';

describe('EdpPasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EdpPasswordService = TestBed.get(EdpPasswordService);
    expect(service).toBeTruthy();
  });
});
