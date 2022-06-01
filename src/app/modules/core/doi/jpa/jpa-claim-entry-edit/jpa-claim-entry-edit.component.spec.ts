import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JpaClaimEntryEditComponent } from './jpa-claim-entry-edit.component';

describe('JpaClaimEntryEditComponent', () => {
  let component: JpaClaimEntryEditComponent;
  let fixture: ComponentFixture<JpaClaimEntryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JpaClaimEntryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JpaClaimEntryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
