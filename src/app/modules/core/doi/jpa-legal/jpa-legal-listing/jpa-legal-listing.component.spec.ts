import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JpaLegalListingComponent } from './jpa-legal-listing.component';

describe('JpaLegalListingComponent', () => {
  let component: JpaLegalListingComponent;
  let fixture: ComponentFixture<JpaLegalListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JpaLegalListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JpaLegalListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
