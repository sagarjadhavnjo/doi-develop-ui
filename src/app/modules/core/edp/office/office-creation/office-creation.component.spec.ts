import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeCreationComponent } from './office-creation.component';

describe('OfficeCreationComponent', () => {
    let component: OfficeCreationComponent;
    let fixture: ComponentFixture<OfficeCreationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OfficeCreationComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OfficeCreationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
