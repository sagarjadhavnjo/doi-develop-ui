import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncrementNewListComponent } from './increment-new-list.component';

describe('IncrementNewListComponent', () => {
  let component: IncrementNewListComponent;
  let fixture: ComponentFixture<IncrementNewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncrementNewListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncrementNewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
