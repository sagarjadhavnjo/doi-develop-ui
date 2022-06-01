import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimListingComponent } from './claim-listing.component';

describe('ClaimListingComponent', () => {
  let component: ClaimListingComponent;
  let fixture: ComponentFixture<ClaimListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
