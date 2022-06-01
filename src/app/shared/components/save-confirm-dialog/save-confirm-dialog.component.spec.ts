import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveConfirmDialogComponent } from './save-confirm-dialog.component';

describe('SaveConfirmDialogComponent', () => {
  let component: SaveConfirmDialogComponent;
  let fixture: ComponentFixture<SaveConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
