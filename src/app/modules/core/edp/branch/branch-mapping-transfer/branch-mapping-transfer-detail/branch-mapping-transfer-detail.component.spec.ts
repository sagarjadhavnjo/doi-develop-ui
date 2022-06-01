import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BranchMappingTransferDetailComponent } from './branch-mapping-transfer-detail.component';


describe('BranchMappingTransferDetailComponent', () => {
  let component: BranchMappingTransferDetailComponent;
  let fixture: ComponentFixture<BranchMappingTransferDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchMappingTransferDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchMappingTransferDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
