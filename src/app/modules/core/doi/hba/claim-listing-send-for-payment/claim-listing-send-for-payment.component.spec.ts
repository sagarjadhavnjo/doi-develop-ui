import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimListingSendForPaymentComponent } from './claim-listing-send-for-payment.component';

describe('ClaimListingSendForPaymentComponent', () => {
  let component: ClaimListingSendForPaymentComponent;
  let fixture: ComponentFixture<ClaimListingSendForPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimListingSendForPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimListingSendForPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
