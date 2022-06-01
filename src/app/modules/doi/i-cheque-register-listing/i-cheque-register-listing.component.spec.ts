import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IChequeRegisterListingComponent } from './i-cheque-register-listing.component';

describe('IChequeRegisterListingComponent', () => {
  let component: IChequeRegisterListingComponent;
  let fixture: ComponentFixture<IChequeRegisterListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IChequeRegisterListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IChequeRegisterListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
