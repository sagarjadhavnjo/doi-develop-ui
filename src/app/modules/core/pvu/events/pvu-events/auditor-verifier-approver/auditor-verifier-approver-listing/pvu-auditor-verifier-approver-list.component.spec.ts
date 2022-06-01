import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PVUAuditorVerifierApproverListComponent } from './pvu-auditor-verifier-approver-list.component';

describe('PVUAuditorVerifierApproverListComponent', () => {
    let component: PVUAuditorVerifierApproverListComponent;
    let fixture: ComponentFixture<PVUAuditorVerifierApproverListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PVUAuditorVerifierApproverListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PVUAuditorVerifierApproverListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
