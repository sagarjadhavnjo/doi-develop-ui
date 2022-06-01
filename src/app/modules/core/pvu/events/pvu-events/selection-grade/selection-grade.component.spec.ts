import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionGradeComponent } from './selection-grade.component';

describe('EmployeeCurrentDetailsComponent', () => {
    let component: SelectionGradeComponent;
    let fixture: ComponentFixture<SelectionGradeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SelectionGradeComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectionGradeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
