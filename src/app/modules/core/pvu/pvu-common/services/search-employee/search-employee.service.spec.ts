import { SearchEmployeeService } from './search-employee.service';
import { TestBed } from '@angular/core/testing';


describe('SearchEmployeeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchEmployeeService = TestBed.get(SearchEmployeeService);
    expect(service).toBeTruthy();
  });
});
