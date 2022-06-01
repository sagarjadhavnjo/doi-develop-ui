import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDmoComponent } from './workflow-dmo.component';

describe('WorkflowDmoComponent', () => {
  let component: WorkflowDmoComponent;
  let fixture: ComponentFixture<WorkflowDmoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowDmoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowDmoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
