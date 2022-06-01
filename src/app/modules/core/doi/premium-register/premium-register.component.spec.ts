import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumRegisterComponent } from './premium-register.component';

describe('PremiumRegisterComponent', () => {
  let component: PremiumRegisterComponent;
  let fixture: ComponentFixture<PremiumRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
