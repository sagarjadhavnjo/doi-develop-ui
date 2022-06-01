import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchCreationListComponent } from './branch-creation-list.component';

describe('BranchCreationListComponent', () => {
    let component: BranchCreationListComponent;
    let fixture: ComponentFixture<BranchCreationListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BranchCreationListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BranchCreationListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
