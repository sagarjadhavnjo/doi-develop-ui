import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpViewOtherOfficeComponent } from './emp-view-other-office.component';

describe('EmpViewOtherOfficeComponent', () => {
  let component: EmpViewOtherOfficeComponent;
  let fixture: ComponentFixture<EmpViewOtherOfficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpViewOtherOfficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpViewOtherOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
