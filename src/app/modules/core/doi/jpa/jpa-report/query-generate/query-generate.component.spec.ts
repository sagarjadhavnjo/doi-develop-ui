import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryGenerateComponent } from './query-generate.component';

describe('QueryGenerateComponent', () => {
  let component: QueryGenerateComponent;
  let fixture: ComponentFixture<QueryGenerateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryGenerateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
