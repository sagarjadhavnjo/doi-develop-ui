import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionNumberDialogComponent } from './transaction-number-dialog.component';

describe('TransactionNumberDialogComponent', () => {
  let component: TransactionNumberDialogComponent;
  let fixture: ComponentFixture<TransactionNumberDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionNumberDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionNumberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
