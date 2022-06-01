import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RopViewComponent } from './rop-view.component';

describe('RopViewComponent', () => {
  let component: RopViewComponent;
  let fixture: ComponentFixture<RopViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RopViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RopViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
