import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JpaMasterFromBankBranchComponent } from './jpa-master-from-bank-branch.component';

describe('JpaMasterFromBankBranchComponent', () => {
  let component: JpaMasterFromBankBranchComponent;
  let fixture: ComponentFixture<JpaMasterFromBankBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JpaMasterFromBankBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JpaMasterFromBankBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
