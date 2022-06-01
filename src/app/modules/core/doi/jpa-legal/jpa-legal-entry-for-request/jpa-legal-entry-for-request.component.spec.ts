import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JpaLegalEntryForRequestComponent } from './jpa-legal-entry-for-request.component';

describe('JpaLegalEntryForRequestComponent', () => {
  let component: JpaLegalEntryForRequestComponent;
  let fixture: ComponentFixture<JpaLegalEntryForRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JpaLegalEntryForRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JpaLegalEntryForRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
