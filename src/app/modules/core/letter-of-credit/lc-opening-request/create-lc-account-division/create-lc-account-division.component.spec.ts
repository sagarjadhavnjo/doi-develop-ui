import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLcAccountDivisionComponent } from './create-lc-account-division.component';

describe('CreateLcAccountDivisionComponent', () => {
  let component: CreateLcAccountDivisionComponent;
  let fixture: ComponentFixture<CreateLcAccountDivisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLcAccountDivisionComponent ]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLcAccountDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
