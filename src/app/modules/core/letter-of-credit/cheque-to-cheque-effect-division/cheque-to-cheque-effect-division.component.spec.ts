import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeToChequeEffectDivisionComponent } from './cheque-to-cheque-effect-division.component';

describe('ChequeToChequeEffectDivisionComponent', () => {
  let component: ChequeToChequeEffectDivisionComponent;
  let fixture: ComponentFixture<ChequeToChequeEffectDivisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequeToChequeEffectDivisionComponent ]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeToChequeEffectDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
