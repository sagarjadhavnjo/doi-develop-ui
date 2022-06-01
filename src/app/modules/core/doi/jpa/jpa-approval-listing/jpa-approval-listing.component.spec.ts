import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JpaApprovalListingComponent } from './jpa-approval-listing.component';

describe('JpaApprovalListingComponent', () => {
  let component: JpaApprovalListingComponent;
  let fixture: ComponentFixture<JpaApprovalListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JpaApprovalListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JpaApprovalListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
