import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayEventListComponent } from './event-list.component';

describe('PayEventListComponent', () => {
    let component: PayEventListComponent;
    let fixture: ComponentFixture<PayEventListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PayEventListComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PayEventListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
