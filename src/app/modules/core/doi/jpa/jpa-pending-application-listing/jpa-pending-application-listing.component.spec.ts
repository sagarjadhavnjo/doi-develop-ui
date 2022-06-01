import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JpaPendingApplicationListingComponent } from './jpa-pending-application-listing.component';

describe('JpaPendingApplicationListingComponent', () => {
  let component: JpaPendingApplicationListingComponent;
  let fixture: ComponentFixture<JpaPendingApplicationListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JpaPendingApplicationListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JpaPendingApplicationListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
