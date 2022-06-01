import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDoiComponent } from './workflow-doi.component';

describe('WorkflowDoiComponent', () => {
  let component: WorkflowDoiComponent;
  let fixture: ComponentFixture<WorkflowDoiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowDoiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowDoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
