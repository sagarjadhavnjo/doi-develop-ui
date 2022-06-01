import { TestBed } from '@angular/core/testing';

import { EdpObjectClassService } from './edp-object-class.service';

describe('EdpObjectClassService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EdpObjectClassService = TestBed.get(EdpObjectClassService);
    expect(service).toBeTruthy();
  });
});
