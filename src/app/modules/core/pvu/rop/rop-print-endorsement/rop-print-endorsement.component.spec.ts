import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RopPrintEndorsementComponent } from './rop-print-endorsement.component';

describe('RopPrintEndorsementComponent', () => {
    let component: RopPrintEndorsementComponent;
    let fixture: ComponentFixture<RopPrintEndorsementComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RopPrintEndorsementComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RopPrintEndorsementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
