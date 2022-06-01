import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HbaPolicyListingComponent } from './hba-policy-listing.component';

describe('HbaPolicyListingComponent', () => {
  let component: HbaPolicyListingComponent;
  let fixture: ComponentFixture<HbaPolicyListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HbaPolicyListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HbaPolicyListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
