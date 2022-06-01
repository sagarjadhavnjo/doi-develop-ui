import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDesignationListComponent } from './update-designation-list.component';

describe('UpdateDesignationListComponent', () => {
    let component: UpdateDesignationListComponent;
    let fixture: ComponentFixture<UpdateDesignationListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UpdateDesignationListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UpdateDesignationListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
