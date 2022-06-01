import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDesignationListComponent } from './add-designation-list.component';

describe('AddDesignationListComponent', () => {
    let component: AddDesignationListComponent;
    let fixture: ComponentFixture<AddDesignationListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AddDesignationListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddDesignationListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
