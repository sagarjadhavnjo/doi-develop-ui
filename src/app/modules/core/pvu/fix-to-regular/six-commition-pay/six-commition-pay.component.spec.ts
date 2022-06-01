import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SixCommitionPayComponent } from './six-commition-pay.component';

describe('SixCommitionPayComponent', () => {
  let component: SixCommitionPayComponent;
  let fixture: ComponentFixture<SixCommitionPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SixCommitionPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SixCommitionPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
