import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SevenCommitionPayComponent } from './seven-commition-pay.component';

describe('SevenCommitionPayComponent', () => {
  let component: SevenCommitionPayComponent;
  let fixture: ComponentFixture<SevenCommitionPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SevenCommitionPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SevenCommitionPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
