import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyPrintoutFormatComponent } from './policy-printout-format.component';

describe('PolicyPrintoutFormatComponent', () => {
  let component: PolicyPrintoutFormatComponent;
  let fixture: ComponentFixture<PolicyPrintoutFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyPrintoutFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyPrintoutFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
