import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EolComponent } from './eol.component';

describe('EolComponent', () => {
  let component: EolComponent;
  let fixture: ComponentFixture<EolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
