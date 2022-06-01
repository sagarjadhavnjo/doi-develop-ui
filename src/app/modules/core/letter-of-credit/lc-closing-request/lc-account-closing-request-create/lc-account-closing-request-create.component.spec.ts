import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcAccountClosingRequestCreateComponent } from './lc-account-closing-request-create.component';

describe('LcAccountClosingRequestCreateComponent', () => {
  let component: LcAccountClosingRequestCreateComponent;
  let fixture: ComponentFixture<LcAccountClosingRequestCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcAccountClosingRequestCreateComponent ]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcAccountClosingRequestCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
