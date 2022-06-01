import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardDialogPVUComponent } from './forward-dialog-pvu.component';

describe('ForwardDialogPVUComponent', () => {
  let component: ForwardDialogPVUComponent;
  let fixture: ComponentFixture<ForwardDialogPVUComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForwardDialogPVUComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwardDialogPVUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
