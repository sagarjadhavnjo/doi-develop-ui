import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceCardexVerificationComponent } from './advice-cardex-verification.component';

describe('AdviceCardexVerificationComponent', () => {
  let component: AdviceCardexVerificationComponent;
  let fixture: ComponentFixture<AdviceCardexVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdviceCardexVerificationComponent ]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviceCardexVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
