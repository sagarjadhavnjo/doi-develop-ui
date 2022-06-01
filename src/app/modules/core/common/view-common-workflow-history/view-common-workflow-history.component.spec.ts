import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewCommonWorkflowHistoryComponent } from './view-common-workflow-history.component';


describe('ViewCommonWorkflowHistoryComponent', () => {
  let component: ViewCommonWorkflowHistoryComponent;
  let fixture: ComponentFixture<ViewCommonWorkflowHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCommonWorkflowHistoryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCommonWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
