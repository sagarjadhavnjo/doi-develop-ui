import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcChequebookListingViewComponent } from './lc-chequebook-listing-view.component';

describe('LcChequebookListingViewComponent', () => {
  let component: LcChequebookListingViewComponent;
  let fixture: ComponentFixture<LcChequebookListingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcChequebookListingViewComponent ]
    })
    
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcChequebookListingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
