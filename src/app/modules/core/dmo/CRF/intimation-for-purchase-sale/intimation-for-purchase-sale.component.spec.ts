import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntimationForPurchaseSaleComponent } from './intimation-for-purchase-sale.component';

describe('IntimationForPurchaseSaleComponent', () => {
  let component: IntimationForPurchaseSaleComponent;
  let fixture: ComponentFixture<IntimationForPurchaseSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntimationForPurchaseSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntimationForPurchaseSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
