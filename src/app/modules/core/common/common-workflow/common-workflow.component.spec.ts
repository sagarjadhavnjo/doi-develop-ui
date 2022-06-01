import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonWorkflowComponent } from './common-workflow.component';


describe('CommonWorkflowComponent', () => {
  let component: CommonWorkflowComponent;
  let fixture: ComponentFixture<CommonWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommonWorkflowComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
