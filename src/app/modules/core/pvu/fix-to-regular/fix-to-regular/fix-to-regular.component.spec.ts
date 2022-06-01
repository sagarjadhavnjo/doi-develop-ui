import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixToRegularComponent } from './fix-to-regular.component';

describe('FixToRegularComponent', () => {
  let component: FixToRegularComponent;
  let fixture: ComponentFixture<FixToRegularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixToRegularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixToRegularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
