import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HbaPolicyEntryComponent } from './hba-policy-entry.component';

describe('HbaPolicyEntryComponent', () => {
  let component: HbaPolicyEntryComponent;
  let fixture: ComponentFixture<HbaPolicyEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HbaPolicyEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HbaPolicyEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
