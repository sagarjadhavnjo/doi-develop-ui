import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedAdviceComponent } from './saved-advice.component';

describe('SavedAdviceComponent', () => {
  let component: SavedAdviceComponent;
  let fixture: ComponentFixture<SavedAdviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedAdviceComponent ]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
