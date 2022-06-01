import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreationListComponent } from './user-creation-list.component';

describe('UserCreationListComponent', () => {
  let component: UserCreationListComponent;
  let fixture: ComponentFixture<UserCreationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCreationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
