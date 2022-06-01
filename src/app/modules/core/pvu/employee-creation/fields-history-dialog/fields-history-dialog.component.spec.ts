import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsHistoryDialogComponent } from './fields-history-dialog.component';

describe('FieldsHistoryDialogComponent', () => {
  let component: FieldsHistoryDialogComponent;
  let fixture: ComponentFixture<FieldsHistoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldsHistoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
