import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChequeToChequeEffectDivisionViewComponent } from './cheque-to-cheque-effect-division-view.component';




describe('ChequeToChequeEffectDivisionViewComponent', () => {
  let component: ChequeToChequeEffectDivisionViewComponent;
  let fixture: ComponentFixture<ChequeToChequeEffectDivisionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequeToChequeEffectDivisionViewComponent ]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeToChequeEffectDivisionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
