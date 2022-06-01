import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JpaSendForPaymentListingComponent } from './jpa-send-for-payment-listing.component';

describe('JpaSendForPaymentListingComponent', () => {
  let component: JpaSendForPaymentListingComponent;
  let fixture: ComponentFixture<JpaSendForPaymentListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JpaSendForPaymentListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JpaSendForPaymentListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
