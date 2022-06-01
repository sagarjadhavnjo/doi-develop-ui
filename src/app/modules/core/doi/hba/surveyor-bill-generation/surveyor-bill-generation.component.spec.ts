import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyorBillGenerationComponent } from './surveyor-bill-generation.component';

describe('SurveyorBillGenerationComponent', () => {
  let component: SurveyorBillGenerationComponent;
  let fixture: ComponentFixture<SurveyorBillGenerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyorBillGenerationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyorBillGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
