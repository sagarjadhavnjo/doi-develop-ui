import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkEmpCreationComponent } from './bulk-emp-creation.component';

describe('BulkEmpCreationComponent', () => {
    let component: BulkEmpCreationComponent;
    let fixture: ComponentFixture<BulkEmpCreationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BulkEmpCreationComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BulkEmpCreationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
