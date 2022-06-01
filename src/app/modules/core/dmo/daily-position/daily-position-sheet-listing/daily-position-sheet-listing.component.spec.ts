import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPositionSheetListingComponent } from './daily-position-sheet-listing.component';

describe('DailyPositionSheetListingComponent', () => {
  let component: DailyPositionSheetListingComponent;
  let fixture: ComponentFixture<DailyPositionSheetListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyPositionSheetListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyPositionSheetListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
