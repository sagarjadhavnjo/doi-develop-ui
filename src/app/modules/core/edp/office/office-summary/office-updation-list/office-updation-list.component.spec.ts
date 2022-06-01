import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeUpdationListComponent } from './office-updation-list.component';

describe('OfficeUpdationListComponent', () => {
    let component: OfficeUpdationListComponent;
    let fixture: ComponentFixture<OfficeUpdationListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OfficeUpdationListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OfficeUpdationListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
