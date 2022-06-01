import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwmaDialogComponent } from './swma-dialog.component';

describe('SwmaDialogComponent', () => {
  let component: SwmaDialogComponent;
  let fixture: ComponentFixture<SwmaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwmaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwmaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
