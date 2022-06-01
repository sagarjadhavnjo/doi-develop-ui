import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IChequeRegisterComponent } from './i-cheque-register.component';

describe('IChequeRegisterComponent', () => {
  let component: IChequeRegisterComponent;
  let fixture: ComponentFixture<IChequeRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IChequeRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IChequeRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
