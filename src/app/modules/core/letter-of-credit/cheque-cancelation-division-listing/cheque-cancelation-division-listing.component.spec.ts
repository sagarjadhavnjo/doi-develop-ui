import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeCancelationDivisionListingComponent } from './cheque-cancelation-division-listing.component';

describe('ChequeCancelationDivisionListingComponent', () => {
  let component: ChequeCancelationDivisionListingComponent;
  let fixture: ComponentFixture<ChequeCancelationDivisionListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequeCancelationDivisionListingComponent ]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeCancelationDivisionListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
