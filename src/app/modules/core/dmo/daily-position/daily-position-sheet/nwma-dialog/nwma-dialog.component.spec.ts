import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NwmaDialogComponent } from './nwma-dialog.component';

describe('NwmaDialogComponent', () => {
  let component: NwmaDialogComponent;
  let fixture: ComponentFixture<NwmaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NwmaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NwmaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
