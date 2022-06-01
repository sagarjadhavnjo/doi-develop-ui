import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyorMasterListingComponent } from './surveyor-master-listing.component';

describe('SurveyorMasterListingComponent', () => {
  let component: SurveyorMasterListingComponent;
  let fixture: ComponentFixture<SurveyorMasterListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyorMasterListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyorMasterListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
