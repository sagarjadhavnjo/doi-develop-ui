import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspensionListComponent } from './suspension-list.component';

describe('SuspensionListComponent', () => {
  let component: SuspensionListComponent;
  let fixture: ComponentFixture<SuspensionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuspensionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspensionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
