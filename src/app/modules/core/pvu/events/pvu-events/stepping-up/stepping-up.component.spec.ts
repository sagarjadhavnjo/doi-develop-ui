import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SteppingUpComponent } from './stepping-up.component';

describe('SteppingUpComponent', () => {
    let component: SteppingUpComponent;
    let fixture: ComponentFixture<SteppingUpComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SteppingUpComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SteppingUpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
