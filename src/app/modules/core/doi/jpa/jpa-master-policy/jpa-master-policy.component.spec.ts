import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JpaMasterPolicyComponent } from './jpa-master-policy.component';

describe('JpaMasterPolicyComponent', () => {
  let component: JpaMasterPolicyComponent;
  let fixture: ComponentFixture<JpaMasterPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JpaMasterPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JpaMasterPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
