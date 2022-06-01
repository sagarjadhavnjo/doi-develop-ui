import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInnerHtmlDialogComponent } from './view-inner-html-dialog.component';

describe('ViewInnerHtmlDialogComponent', () => {
  let component: ViewInnerHtmlDialogComponent;
  let fixture: ComponentFixture<ViewInnerHtmlDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInnerHtmlDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInnerHtmlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
