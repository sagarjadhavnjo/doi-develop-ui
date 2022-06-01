import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDataDialogComponent } from './view-data-dialog.component';

describe('ViewDataDialogComponent', () => {
  let component: ViewDataDialogComponent;
  let fixture: ComponentFixture<ViewDataDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDataDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
