import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiClaimRecoveryComponent } from './ri-claim-recovery.component';

describe('RiClaimRecoveryComponent', () => {
  let component: RiClaimRecoveryComponent;
  let fixture: ComponentFixture<RiClaimRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiClaimRecoveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiClaimRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
