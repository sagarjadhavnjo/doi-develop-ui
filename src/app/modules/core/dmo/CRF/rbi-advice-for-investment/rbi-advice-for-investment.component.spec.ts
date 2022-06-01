import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RBIAdviceForInvestmentComponent } from './rbi-advice-for-investment.component';

describe('RBIAdviceForInvestmentComponent', () => {
  let component: RBIAdviceForInvestmentComponent;
  let fixture: ComponentFixture<RBIAdviceForInvestmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RBIAdviceForInvestmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RBIAdviceForInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
