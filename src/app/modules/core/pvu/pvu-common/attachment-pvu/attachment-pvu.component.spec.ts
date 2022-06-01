import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentPvuComponent } from './attachment-pvu.component';

describe('AttachmentPvuComponent', () => {
  let component: AttachmentPvuComponent;
  let fixture: ComponentFixture<AttachmentPvuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentPvuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentPvuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
