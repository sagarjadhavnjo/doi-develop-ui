import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDetailsLfComponent } from './workflow-details-lf.component';

describe('WorkflowDetailsLfComponent', () => {
  let component: WorkflowDetailsLfComponent;
  let fixture: ComponentFixture<WorkflowDetailsLfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowDetailsLfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowDetailsLfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
