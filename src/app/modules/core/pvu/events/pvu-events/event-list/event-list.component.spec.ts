import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PVUEventListComponent } from './event-list.component';

describe('PVUEventListComponent', () => {
    let component: PVUEventListComponent;
    let fixture: ComponentFixture<PVUEventListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PVUEventListComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PVUEventListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
