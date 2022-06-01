import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDoiModuleComponent } from './workflow-doi-module.component';

describe('WorkflowDoiModuleComponent', () => {
  let component: WorkflowDoiModuleComponent;
  let fixture: ComponentFixture<WorkflowDoiModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowDoiModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowDoiModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
