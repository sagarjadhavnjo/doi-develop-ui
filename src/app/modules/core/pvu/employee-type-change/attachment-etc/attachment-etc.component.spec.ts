import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentEtcComponent } from './attachment-etc.component';

describe('AttachmentEtcComponent', () => {
  let component: AttachmentEtcComponent;
  let fixture: ComponentFixture<AttachmentEtcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentEtcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentEtcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
