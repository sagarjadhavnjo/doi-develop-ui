import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLcAccountListingDivisionComponent } from './create-lc-account-listing-division.component';

describe('CreateLcAccountListingDivisionComponent', () => {
  let component: CreateLcAccountListingDivisionComponent;
  let fixture: ComponentFixture<CreateLcAccountListingDivisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLcAccountListingDivisionComponent ]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLcAccountListingDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
