import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappedBranchDialogComponent } from './mapped-branch-dialog.component';

describe('MappedBranchDialogComponent', () => {
  let component: MappedBranchDialogComponent;
  let fixture: ComponentFixture<MappedBranchDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappedBranchDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappedBranchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
