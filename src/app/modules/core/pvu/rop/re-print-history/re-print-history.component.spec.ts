import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RePrintHistoryComponent } from './re-print-history.component';

describe('RePrintHistoryComponent', () => {
  let component: RePrintHistoryComponent;
  let fixture: ComponentFixture<RePrintHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RePrintHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RePrintHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
