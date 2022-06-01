import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferJoiningComponent } from './transfer-joining.component';

describe('TransferJoiningComponent', () => {
  let component: TransferJoiningComponent;
  let fixture: ComponentFixture<TransferJoiningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferJoiningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferJoiningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
