import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumRefundEntryComponent } from './premium-refund-entry.component';

describe('PremiumRefundEntryComponent', () => {
  let component: PremiumRefundEntryComponent;
  let fixture: ComponentFixture<PremiumRefundEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumRefundEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumRefundEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
