import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferJoiningListComponent } from './transfer-joining-list.component';

describe('TransferJoiningListComponent', () => {
  let component: TransferJoiningListComponent;
  let fixture: ComponentFixture<TransferJoiningListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferJoiningListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferJoiningListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
