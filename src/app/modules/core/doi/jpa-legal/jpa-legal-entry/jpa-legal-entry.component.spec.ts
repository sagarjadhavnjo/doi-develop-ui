import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JpaLegalEntryComponent } from './jpa-legal-entry.component';

describe('JpaLegalEntryComponent', () => {
  let component: JpaLegalEntryComponent;
  let fixture: ComponentFixture<JpaLegalEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JpaLegalEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JpaLegalEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
