import { TestBed } from '@angular/core/testing';
import { SuspensionService } from './suspension.service';

describe('SuspensionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SuspensionService = TestBed.get(SuspensionService);
    expect(service).toBeTruthy();
  });
});
