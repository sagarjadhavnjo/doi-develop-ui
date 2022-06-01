import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixToRegularListComponent } from './fix-to-regular-list.component';

describe('FixToRegularListingComponent', () => {
  let component: FixToRegularListComponent;
  let fixture: ComponentFixture<FixToRegularListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixToRegularListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixToRegularListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
