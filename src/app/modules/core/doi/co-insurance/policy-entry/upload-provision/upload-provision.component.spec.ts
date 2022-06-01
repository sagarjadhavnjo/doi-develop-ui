import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProvisionComponent } from './upload-provision.component';

describe('UploadProvisionComponent', () => {
  let component: UploadProvisionComponent;
  let fixture: ComponentFixture<UploadProvisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadProvisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadProvisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
