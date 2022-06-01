import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NssfLoanReceivedAddDetailsComponent } from './nssf-loan-received-add-details.component';

describe('NssfLoanReceivedAddDetailsComponent', () => {
  let component: NssfLoanReceivedAddDetailsComponent;
  let fixture: ComponentFixture<NssfLoanReceivedAddDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NssfLoanReceivedAddDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NssfLoanReceivedAddDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
