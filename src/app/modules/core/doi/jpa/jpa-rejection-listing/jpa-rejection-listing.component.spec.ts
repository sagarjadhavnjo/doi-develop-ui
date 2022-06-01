import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JpaRejectionListingComponent } from './jpa-rejection-listing.component';

describe('JpaRejectionListingComponent', () => {
  let component: JpaRejectionListingComponent;
  let fixture: ComponentFixture<JpaRejectionListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JpaRejectionListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JpaRejectionListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
