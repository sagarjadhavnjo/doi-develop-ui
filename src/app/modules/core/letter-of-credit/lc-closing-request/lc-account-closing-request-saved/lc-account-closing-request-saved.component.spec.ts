import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcAccountClosingRequestSavedComponent } from './lc-account-closing-request-saved.component';

describe('LcAccountClosingRequestSavedComponent', () => {
  let component: LcAccountClosingRequestSavedComponent;
  let fixture: ComponentFixture<LcAccountClosingRequestSavedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcAccountClosingRequestSavedComponent ]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcAccountClosingRequestSavedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
