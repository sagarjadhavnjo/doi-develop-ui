import { TestBed } from '@angular/core/testing';

import { EmployeeCreationPopUpServiceService } from './employee-creation-pop-up-service.service';

describe('EmployeeCreationPopUpServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmployeeCreationPopUpServiceService = TestBed.get(EmployeeCreationPopUpServiceService);
    expect(service).toBeTruthy();
  });
});
