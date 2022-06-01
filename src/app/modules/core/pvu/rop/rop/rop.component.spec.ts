import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RopComponent } from './rop.component';

describe('RopComponent', () => {
    let component: RopComponent;
    let fixture: ComponentFixture<RopComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RopComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RopComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
