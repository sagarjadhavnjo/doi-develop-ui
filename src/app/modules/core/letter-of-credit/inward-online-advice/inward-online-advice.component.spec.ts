import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardOnlineAdviceComponent } from './inward-online-advice.component';

describe('InwardOnlineAdviceComponent', () => {
  let component: InwardOnlineAdviceComponent;
  let fixture: ComponentFixture<InwardOnlineAdviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InwardOnlineAdviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InwardOnlineAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
