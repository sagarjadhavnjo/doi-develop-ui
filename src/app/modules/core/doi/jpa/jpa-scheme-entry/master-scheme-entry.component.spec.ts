import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSchemeEntryComponent } from './master-scheme-entry.component';

describe('MasterSchemeEntryComponent', () => {
  let component: MasterSchemeEntryComponent;
  let fixture: ComponentFixture<MasterSchemeEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterSchemeEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterSchemeEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
