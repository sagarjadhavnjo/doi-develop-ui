import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcVerificationToEditComponent } from './lc-verification-to-edit.component';

describe('LcVerificationToEditComponent', () => {
  let component: LcVerificationToEditComponent;
  let fixture: ComponentFixture<LcVerificationToEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcVerificationToEditComponent ]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcVerificationToEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
