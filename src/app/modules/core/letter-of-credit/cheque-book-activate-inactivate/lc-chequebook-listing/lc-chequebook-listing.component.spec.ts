import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcChequebookListingComponent } from './lc-chequebook-listing.component';

describe('LcChequebookListingComponent', () => {
  let component: LcChequebookListingComponent;
  let fixture: ComponentFixture<LcChequebookListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcChequebookListingComponent ]
    })
    .compileComponents();
  }));

  
  beforeEach(() => {
    fixture = TestBed.createComponent(LcChequebookListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
