import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JpaPendingApprovalListingComponent } from './jpa-pending-approval-listing.component';

describe('JpaPendingApprovalListingComponent', () => {
  let component: JpaPendingApprovalListingComponent;
  let fixture: ComponentFixture<JpaPendingApprovalListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JpaPendingApprovalListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JpaPendingApprovalListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
