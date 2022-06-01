import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPositionSheetComponent } from './daily-position-sheet.component';

describe('DailyPositionSheetComponent', () => {
  let component: DailyPositionSheetComponent;
  let fixture: ComponentFixture<DailyPositionSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyPositionSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyPositionSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
