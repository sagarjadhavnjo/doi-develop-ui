import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EolListComponent } from './eol-list.component';

describe('EolListComponent', () => {
  let component: EolListComponent;
  let fixture: ComponentFixture<EolListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EolListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EolListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
