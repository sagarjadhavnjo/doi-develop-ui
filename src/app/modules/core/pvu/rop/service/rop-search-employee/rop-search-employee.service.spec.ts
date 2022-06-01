import { TestBed } from '@angular/core/testing';
import { RopSearchEmployeeService } from './rop-search-employee.service';


describe('RopSearchEmployeeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RopSearchEmployeeService = TestBed.get(RopSearchEmployeeService);
    expect(service).toBeTruthy();
  });
});
