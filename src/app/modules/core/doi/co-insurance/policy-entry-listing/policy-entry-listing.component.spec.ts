import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyEntryListingComponent } from './policy-entry-listing.component';

describe('PolicyEntryListingComponent', () => {
  let component: PolicyEntryListingComponent;
  let fixture: ComponentFixture<PolicyEntryListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyEntryListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyEntryListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
