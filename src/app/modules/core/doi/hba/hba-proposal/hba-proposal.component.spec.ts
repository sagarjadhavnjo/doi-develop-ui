import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HbaProposalComponent } from './hba-proposal.component';

describe('HbaProposalComponent', () => {
  let component: HbaProposalComponent;
  let fixture: ComponentFixture<HbaProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HbaProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HbaProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
