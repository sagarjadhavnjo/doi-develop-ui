import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOfScaleComponent } from './change-of-scale.component';

describe('ChangeOfScaleComponent', () => {
    let component: ChangeOfScaleComponent;
    let fixture: ComponentFixture<ChangeOfScaleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ChangeOfScaleComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChangeOfScaleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
