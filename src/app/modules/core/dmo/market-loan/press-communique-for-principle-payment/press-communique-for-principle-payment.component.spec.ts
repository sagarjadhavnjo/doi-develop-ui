import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PressCommuniqueForPrinciplePaymentComponent } from './press-communique-for-principle-payment.component';

describe('PressCommuniqueForPrinciplePaymentComponent', () => {
  let component: PressCommuniqueForPrinciplePaymentComponent;
  let fixture: ComponentFixture<PressCommuniqueForPrinciplePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PressCommuniqueForPrinciplePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PressCommuniqueForPrinciplePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
