import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcAdviceVerificationComponent } from './lc-advice-verification.component';

describe('LcAdviceVerificationComponent', () => {
  let component: LcAdviceVerificationComponent;
  let fixture: ComponentFixture<LcAdviceVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcAdviceVerificationComponent ]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcAdviceVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
