import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyEntryComponent } from './policy-entry.component';

describe('PolicyEntryComponent', () => {
  let component: PolicyEntryComponent;
  let fixture: ComponentFixture<PolicyEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
