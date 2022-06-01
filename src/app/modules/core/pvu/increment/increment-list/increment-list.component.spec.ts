import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncrementListComponent } from './increment-list.component';

describe('IncrementListComponent', () => {
  let component: IncrementListComponent;
  let fixture: ComponentFixture<IncrementListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncrementListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncrementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
