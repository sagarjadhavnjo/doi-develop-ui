import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCreationListComponent } from './employee-creation-list.component';

describe('EmployeeCreationListComponent', () => {
  let component: EmployeeCreationListComponent;
  let fixture: ComponentFixture<EmployeeCreationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeCreationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeCreationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
