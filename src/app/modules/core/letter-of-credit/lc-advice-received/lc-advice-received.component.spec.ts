import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcAdviceReceivedComponent } from './lc-advice-received.component';

describe('LcAdviceReceivedComponent', () => {
  let component: LcAdviceReceivedComponent;
  let fixture: ComponentFixture<LcAdviceReceivedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcAdviceReceivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcAdviceReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
