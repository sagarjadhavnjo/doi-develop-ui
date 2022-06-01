import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteeEntryComponent } from './guarantee-entry.component';

describe('GuaranteeEntryComponent', () => {
  let component: GuaranteeEntryComponent;
  let fixture: ComponentFixture<GuaranteeEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuaranteeEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuaranteeEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
