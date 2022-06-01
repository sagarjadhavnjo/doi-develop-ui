import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JpaQueryDialogComponent } from './jpa-query-dialog.component';

describe('JpaQueryDialogComponent', () => {
  let component: JpaQueryDialogComponent;
  let fixture: ComponentFixture<JpaQueryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JpaQueryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JpaQueryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
