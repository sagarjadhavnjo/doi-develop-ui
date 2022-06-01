import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageBranchDialogComponent } from './message-branch-dialog.component';

describe('MessageBranchDialogComponent', () => {
  let component: MessageBranchDialogComponent;
  let fixture: ComponentFixture<MessageBranchDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageBranchDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageBranchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
