import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryDetailsCommonDialogComponent } from './history-details-common-dialog.component';

describe('HistoryDetailsCommonDialogComponent', () => {
  let component: HistoryDetailsCommonDialogComponent;
  let fixture: ComponentFixture<HistoryDetailsCommonDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryDetailsCommonDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryDetailsCommonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
