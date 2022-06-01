import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JpaClaimEntryComponent } from './jpa-claim-entry.component';

describe('JpaClaimEntryComponent', () => {
  let component: JpaClaimEntryComponent;
  let fixture: ComponentFixture<JpaClaimEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JpaClaimEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JpaClaimEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
