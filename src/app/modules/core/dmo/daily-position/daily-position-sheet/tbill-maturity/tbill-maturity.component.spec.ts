import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TbillMaturityComponent } from './tbill-maturity.component';

describe('TbillMaturityComponent', () => {
  let component: TbillMaturityComponent;
  let fixture: ComponentFixture<TbillMaturityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TbillMaturityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TbillMaturityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
