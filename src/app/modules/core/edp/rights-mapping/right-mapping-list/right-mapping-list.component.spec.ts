import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightMappingListComponent } from './right-mapping-list.component';

describe('RightMappingListComponent', () => {
  let component: RightMappingListComponent;
  let fixture: ComponentFixture<RightMappingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightMappingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
