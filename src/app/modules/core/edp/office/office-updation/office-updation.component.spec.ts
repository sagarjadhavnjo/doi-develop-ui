import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficesUpdationComponent } from './office-updation.component';

describe('OfficesUpdationComponent', () => {
  let component: OfficesUpdationComponent;
  let fixture: ComponentFixture<OfficesUpdationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficesUpdationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficesUpdationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
