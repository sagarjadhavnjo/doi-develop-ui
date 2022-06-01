import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyorBillGenerationListingComponent } from './surveyor-bill-generation-listing.component';

describe('SurveyorBillGenerationListingComponent', () => {
  let component: SurveyorBillGenerationListingComponent;
  let fixture: ComponentFixture<SurveyorBillGenerationListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyorBillGenerationListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyorBillGenerationListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
