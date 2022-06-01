import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JpaRejectionQueryDialogComponent } from './jpa-rejection-query-dialog.component';

describe('JpaRejectionQueryDialogComponent', () => {
  let component: JpaRejectionQueryDialogComponent;
  let fixture: ComponentFixture<JpaRejectionQueryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JpaRejectionQueryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JpaRejectionQueryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
