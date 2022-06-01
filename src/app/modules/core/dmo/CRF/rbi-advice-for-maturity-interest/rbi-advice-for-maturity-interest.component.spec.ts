import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RbiAdviceForMaturityInterestComponent } from './rbi-advice-for-maturity-interest.component';

describe('RbiAdviceForMaturityInterestComponent', () => {
  let component: RbiAdviceForMaturityInterestComponent;
  let fixture: ComponentFixture<RbiAdviceForMaturityInterestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RbiAdviceForMaturityInterestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RbiAdviceForMaturityInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
