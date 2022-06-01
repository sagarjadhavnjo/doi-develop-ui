import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoClaimComponent } from './no-claim.component';

describe('NoClaimComponent', () => {
  let component: NoClaimComponent;
  let fixture: ComponentFixture<NoClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
