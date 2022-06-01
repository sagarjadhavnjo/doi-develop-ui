import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RopListComponent } from './rop-list.component';

describe('RopListComponent', () => {
    let component: RopListComponent;
    let fixture: ComponentFixture<RopListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RopListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RopListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
