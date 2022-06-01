import { TestBed } from '@angular/core/testing';
import { ROPService } from './rop.service';

describe('ROPService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ROPService = TestBed.get(ROPService);
    expect(service).toBeTruthy();
  });
});
