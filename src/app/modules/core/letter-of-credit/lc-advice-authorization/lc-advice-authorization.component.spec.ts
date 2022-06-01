import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcAdviceAuthorizationComponent } from './lc-advice-authorization.component';

describe('LcAdviceAuthorizationComponent', () => {
  let component: LcAdviceAuthorizationComponent;
  let fixture: ComponentFixture<LcAdviceAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcAdviceAuthorizationComponent ]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcAdviceAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
