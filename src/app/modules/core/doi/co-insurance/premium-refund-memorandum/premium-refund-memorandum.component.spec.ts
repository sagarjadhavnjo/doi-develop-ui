import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumRefundMemorandumComponent } from './premium-refund-memorandum.component';

describe('PremiumRefundMemorandumComponent', () => {
  let component: PremiumRefundMemorandumComponent;
  let fixture: ComponentFixture<PremiumRefundMemorandumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumRefundMemorandumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumRefundMemorandumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
