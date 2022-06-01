import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HbaProposalListingComponent } from './hba-proposal-listing.component';

describe('HbaProposalListingComponent', () => {
  let component: HbaProposalListingComponent;
  let fixture: ComponentFixture<HbaProposalListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HbaProposalListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HbaProposalListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
