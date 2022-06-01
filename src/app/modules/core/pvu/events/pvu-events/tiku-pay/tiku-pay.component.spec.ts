import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TikuPayComponent } from './tiku-pay.component';

describe('TikuPayComponent', () => {
  let component: TikuPayComponent;
  let fixture: ComponentFixture<TikuPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TikuPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TikuPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
