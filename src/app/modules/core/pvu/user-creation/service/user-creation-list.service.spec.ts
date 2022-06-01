import { TestBed } from '@angular/core/testing';

import { UserCreationListService } from './user-creation-list.service';

describe('UserCreationListService', () => {
  let service: UserCreationListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserCreationListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
