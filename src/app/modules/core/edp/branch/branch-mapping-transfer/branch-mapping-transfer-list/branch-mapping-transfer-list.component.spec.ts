import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchMappingTransferListComponent } from './branch-mapping-transfer-list.component';

describe('BranchMappingTransferListComponent', () => {
  let component: BranchMappingTransferListComponent;
  let fixture: ComponentFixture<BranchMappingTransferListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchMappingTransferListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchMappingTransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
