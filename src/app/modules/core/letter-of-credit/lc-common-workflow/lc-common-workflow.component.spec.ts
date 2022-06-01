import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcCommonWorkflowComponent } from './lc-common-workflow.component';

describe('LcCommonWorkflowComponent', () => {
  let component: LcCommonWorkflowComponent;
  let fixture: ComponentFixture<LcCommonWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcCommonWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcCommonWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
