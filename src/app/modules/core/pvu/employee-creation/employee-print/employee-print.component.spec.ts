import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePrintComponent } from './employee-print.component';

describe('EmployeePrintComponent', () => {
  let component: EmployeePrintComponent;
  let fixture: ComponentFixture<EmployeePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
