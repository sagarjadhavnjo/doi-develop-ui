import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightMappingComponent } from './right-mapping.component';

describe('RightMappingComponent', () => {
    let component: RightMappingComponent;
    let fixture: ComponentFixture<RightMappingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RightMappingComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RightMappingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
