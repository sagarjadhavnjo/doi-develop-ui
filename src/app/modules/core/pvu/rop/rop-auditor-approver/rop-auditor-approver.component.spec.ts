import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RopAuditorApproverComponent } from './rop-auditor-approver.component';

describe('RopAuditorApproverComponent', () => {
    let component: RopAuditorApproverComponent;
    let fixture: ComponentFixture<RopAuditorApproverComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RopAuditorApproverComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RopAuditorApproverComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
