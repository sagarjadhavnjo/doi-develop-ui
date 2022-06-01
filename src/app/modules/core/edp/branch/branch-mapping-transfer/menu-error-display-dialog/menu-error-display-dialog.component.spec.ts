import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuErrorDisplayDialogComponent } from './menu-error-display-dialog.component';

describe('MenuErrorDisplayDialogComponent', () => {
  let component: MenuErrorDisplayDialogComponent;
  let fixture: ComponentFixture<MenuErrorDisplayDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuErrorDisplayDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuErrorDisplayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
