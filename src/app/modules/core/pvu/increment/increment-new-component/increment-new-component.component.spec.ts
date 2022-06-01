import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncrementNewComponentComponent } from './increment-new-component.component';

describe('IncrementNewComponentComponent', () => {
  let component: IncrementNewComponentComponent;
  let fixture: ComponentFixture<IncrementNewComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncrementNewComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncrementNewComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
