import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcAdvicePreparationViewComponent } from './lc-advice-preparation-view.component';

describe('LcAdvicePreparationViewComponent', () => {
  let component: LcAdvicePreparationViewComponent;
  let fixture: ComponentFixture<LcAdvicePreparationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcAdvicePreparationViewComponent ]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcAdvicePreparationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
