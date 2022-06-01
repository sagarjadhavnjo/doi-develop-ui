import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JpaLegalEntryForRequestListingComponent } from './jpa-legal-entry-for-request-listing.component';

describe('JpaLegalEntryForRequestListingComponent', () => {
  let component: JpaLegalEntryForRequestListingComponent;
  let fixture: ComponentFixture<JpaLegalEntryForRequestListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JpaLegalEntryForRequestListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JpaLegalEntryForRequestListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
