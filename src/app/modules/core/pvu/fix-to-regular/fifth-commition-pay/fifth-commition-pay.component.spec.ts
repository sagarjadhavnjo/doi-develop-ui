import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FifthCommitionPayComponent } from './fifth-commition-pay.component';

describe('FifthCommitionPayComponent', () => {
  let component: FifthCommitionPayComponent;
  let fixture: ComponentFixture<FifthCommitionPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FifthCommitionPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FifthCommitionPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
