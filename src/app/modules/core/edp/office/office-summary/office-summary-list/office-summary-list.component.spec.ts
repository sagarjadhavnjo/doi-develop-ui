import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeSummaryListComponent } from './office-summary-list.component';

describe('OfficeSummaryListComponent', () => {
    let component: OfficeSummaryListComponent;
    let fixture: ComponentFixture<OfficeSummaryListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OfficeSummaryListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OfficeSummaryListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
