import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeemedDateComponent } from './deemed-date.component';

describe('DeemedDateComponent', () => {
    let component: DeemedDateComponent;
    let fixture: ComponentFixture<DeemedDateComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DeemedDateComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DeemedDateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
