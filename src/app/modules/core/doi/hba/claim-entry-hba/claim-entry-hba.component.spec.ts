import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimEntryHbaComponent } from './claim-entry-hba.component';

describe('ClaimEntryHbaComponent', () => {
  let component: ClaimEntryHbaComponent;
  let fixture: ComponentFixture<ClaimEntryHbaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimEntryHbaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimEntryHbaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
