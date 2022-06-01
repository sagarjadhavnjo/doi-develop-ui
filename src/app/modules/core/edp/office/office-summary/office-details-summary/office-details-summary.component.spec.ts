import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeDetailsSummaryComponent } from './office-details-summary.component';

describe('OfficeDetailsSummaryComponent', () => {
  let component: OfficeDetailsSummaryComponent;
  let fixture: ComponentFixture<OfficeDetailsSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeDetailsSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeDetailsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
