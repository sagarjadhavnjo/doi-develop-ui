import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcEventComponent } from './ec-event.component';

describe('EcEventComponent', () => {
  let component: EcEventComponent;
  let fixture: ComponentFixture<EcEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
