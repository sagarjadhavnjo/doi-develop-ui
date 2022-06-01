import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInInfoComponent } from './sign-in-info.component';

describe('SignInInfoComponent', () => {
  let component: SignInInfoComponent;
  let fixture: ComponentFixture<SignInInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
