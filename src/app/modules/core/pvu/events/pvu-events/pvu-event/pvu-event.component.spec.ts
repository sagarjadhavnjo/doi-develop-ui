import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PVUEventComponent } from './pvu-event.component';

describe('PVUEventComponent', () => {
    let component: PVUEventComponent;
    let fixture: ComponentFixture<PVUEventComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PVUEventComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PVUEventComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
