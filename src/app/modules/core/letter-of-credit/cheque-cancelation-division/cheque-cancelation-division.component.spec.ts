import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeCancelationDivisionComponent } from './cheque-cancelation-division.component';

describe('ChequeCancelationDivisionComponent', () => {
  let component: ChequeCancelationDivisionComponent;
  let fixture: ComponentFixture<ChequeCancelationDivisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequeCancelationDivisionComponent ]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeCancelationDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
