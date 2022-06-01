import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcDistributionCircleComponent } from './lc-distribution-circle.component';

describe('LcDistributionCircleComponent', () => {
  let component: LcDistributionCircleComponent;
  let fixture: ComponentFixture<LcDistributionCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcDistributionCircleComponent ]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcDistributionCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
