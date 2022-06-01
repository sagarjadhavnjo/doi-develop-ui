import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeniorScaleComponent } from './senior-scale.component';

describe('SeniorScaleComponent', () => {
    let component: SeniorScaleComponent;
    let fixture: ComponentFixture<SeniorScaleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SeniorScaleComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SeniorScaleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
