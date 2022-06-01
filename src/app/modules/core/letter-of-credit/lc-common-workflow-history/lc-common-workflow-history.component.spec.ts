import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcCommonWorkflowHistoryComponent } from './lc-common-workflow-history.component';

describe('LcCommonWorkflowHistoryComponent', () => {
  let component: LcCommonWorkflowHistoryComponent;
  let fixture: ComponentFixture<LcCommonWorkflowHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcCommonWorkflowHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcCommonWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
