import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NssfLoanApprovedApproveComponent } from './nssf-loan-approved-approve.component';

describe('NssfLoanApprovedApproveComponent', () => {
  let component: NssfLoanApprovedApproveComponent;
  let fixture: ComponentFixture<NssfLoanApprovedApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NssfLoanApprovedApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NssfLoanApprovedApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
