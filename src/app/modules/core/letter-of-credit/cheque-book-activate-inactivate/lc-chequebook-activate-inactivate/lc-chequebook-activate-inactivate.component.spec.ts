import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcChequebookActivateInactivateComponent } from './lc-chequebook-activate-inactivate.component';

describe('LcChequebookActivateInactivateComponent', () => {
  let component: LcChequebookActivateInactivateComponent;
  let fixture: ComponentFixture<LcChequebookActivateInactivateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcChequebookActivateInactivateComponent ]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcChequebookActivateInactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
