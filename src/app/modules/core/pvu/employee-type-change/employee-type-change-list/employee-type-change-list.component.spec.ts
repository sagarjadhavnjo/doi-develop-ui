import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTypeChangeListComponent } from './employee-type-change-list.component';

describe('EmployeeTypeChangeListComponent', () => {
  let component: EmployeeTypeChangeListComponent;
  let fixture: ComponentFixture<EmployeeTypeChangeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeTypeChangeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTypeChangeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
