import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumRefundListingComponent } from './premium-refund-listing.component';

describe('PremiumRefundListingComponent', () => {
  let component: PremiumRefundListingComponent;
  let fixture: ComponentFixture<PremiumRefundListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumRefundListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumRefundListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
