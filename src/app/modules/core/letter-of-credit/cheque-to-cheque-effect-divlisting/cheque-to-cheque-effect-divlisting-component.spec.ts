import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChequeToChequeEffectDivisionListingComponent } from './cheque-to-cheque-effect-divlisting.component';



describe('ChequeToChequeEffectDivisionListingComponent', () => {
  let component: ChequeToChequeEffectDivisionListingComponent;
  let fixture: ComponentFixture<ChequeToChequeEffectDivisionListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequeToChequeEffectDivisionListingComponent ]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeToChequeEffectDivisionListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
