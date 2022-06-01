import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectClassMappingComponent } from './object-class-mapping.component';

describe('ObjectClassMappingComponent', () => {
    let component: ObjectClassMappingComponent;
    let fixture: ComponentFixture<ObjectClassMappingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ObjectClassMappingComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ObjectClassMappingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
