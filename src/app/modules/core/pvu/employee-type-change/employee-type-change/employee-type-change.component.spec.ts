import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTypeChangeComponent } from './employee-type-change.component';

describe('EmployeeTypeChangeComponent', () => {
  let component: EmployeeTypeChangeComponent;
  let fixture: ComponentFixture<EmployeeTypeChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeTypeChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTypeChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
