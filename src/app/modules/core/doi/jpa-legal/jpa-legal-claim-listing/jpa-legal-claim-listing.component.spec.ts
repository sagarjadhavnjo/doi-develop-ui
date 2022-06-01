import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JpaLegalClaimListingComponent } from './jpa-legal-claim-listing.component';

describe('JpaLegalClaimListingComponent', () => {
  let component: JpaLegalClaimListingComponent;
  let fixture: ComponentFixture<JpaLegalClaimListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JpaLegalClaimListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JpaLegalClaimListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
