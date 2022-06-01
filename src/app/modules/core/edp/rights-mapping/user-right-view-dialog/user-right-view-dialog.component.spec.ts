import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRightViewDialogComponent } from './user-right-view-dialog.component';

describe('UserRightViewDialogComponent', () => {
  let component: UserRightViewDialogComponent;
  let fixture: ComponentFixture<UserRightViewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRightViewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRightViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
