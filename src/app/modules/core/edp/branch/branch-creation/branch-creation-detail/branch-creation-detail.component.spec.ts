import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchCreationDetailComponent } from './branch-creation-detail.component';

describe('BranchCreationDetailComponent', () => {
    let component: BranchCreationDetailComponent;
    let fixture: ComponentFixture<BranchCreationDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BranchCreationDetailComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BranchCreationDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
