import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdraftDialogComponent } from './overdraft-dialog.component';

describe('OverdraftDialogComponent', () => {
  let component: OverdraftDialogComponent;
  let fixture: ComponentFixture<OverdraftDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverdraftDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdraftDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
