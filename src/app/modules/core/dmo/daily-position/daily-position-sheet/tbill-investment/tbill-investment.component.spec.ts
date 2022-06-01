import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TbillInvestmentComponent } from './tbill-investment.component';

describe('TbillInvestmentComponent', () => {
  let component: TbillInvestmentComponent;
  let fixture: ComponentFixture<TbillInvestmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TbillInvestmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TbillInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
