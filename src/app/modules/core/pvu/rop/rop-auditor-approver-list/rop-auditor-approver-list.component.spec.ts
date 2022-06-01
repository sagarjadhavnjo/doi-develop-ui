import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RopAuditorApproverListComponent } from './rop-auditor-approver-list.component';

describe('RopAuditorApproverListComponent', () => {
    let component: RopAuditorApproverListComponent;
    let fixture: ComponentFixture<RopAuditorApproverListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RopAuditorApproverListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RopAuditorApproverListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
