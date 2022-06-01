import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionMessageDialogComponent } from './transaction-message-dialog.component';

describe('TransactionMessageDialogComponent', () => {
  let component: TransactionMessageDialogComponent;
  let fixture: ComponentFixture<TransactionMessageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionMessageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
