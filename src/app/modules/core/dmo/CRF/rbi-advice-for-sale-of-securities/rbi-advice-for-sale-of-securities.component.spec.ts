import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RbiAdviceForSaleOfSecuritiesComponent } from './rbi-advice-for-sale-of-securities.component';

describe('RbiAdviceForSaleOfSecuritiesComponent', () => {
  let component: RbiAdviceForSaleOfSecuritiesComponent;
  let fixture: ComponentFixture<RbiAdviceForSaleOfSecuritiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RbiAdviceForSaleOfSecuritiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RbiAdviceForSaleOfSecuritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
