import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeCancelationDivisionViewComponent } from './cheque-cancelation-division-view.component';

describe('ChequeCancelationDivisionViewComponent', () => {
  let component: ChequeCancelationDivisionViewComponent;
  let fixture: ComponentFixture<ChequeCancelationDivisionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequeCancelationDivisionViewComponent ]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeCancelationDivisionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
