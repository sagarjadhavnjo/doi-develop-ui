import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PVUPrintOrderComponent } from './pvu-print-order.component';

describe('RopPrintEndorsementComponent', () => {
    let component: PVUPrintOrderComponent;
    let fixture: ComponentFixture<PVUPrintOrderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PVUPrintOrderComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PVUPrintOrderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
