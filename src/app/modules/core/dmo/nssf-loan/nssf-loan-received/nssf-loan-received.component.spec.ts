import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NssfLoanReceivedComponent } from './nssf-loan-received.component';

describe('NssfLoanReceivedComponent', () => {
  let component: NssfLoanReceivedComponent;
  let fixture: ComponentFixture<NssfLoanReceivedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NssfLoanReceivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NssfLoanReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
