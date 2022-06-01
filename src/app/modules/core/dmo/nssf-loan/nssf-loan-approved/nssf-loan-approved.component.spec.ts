import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NssfLoanApprovedComponent } from './nssf-loan-approved.component';

describe('NssfLoanApprovedComponent', () => {
  let component: NssfLoanApprovedComponent;
  let fixture: ComponentFixture<NssfLoanApprovedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NssfLoanApprovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NssfLoanApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
