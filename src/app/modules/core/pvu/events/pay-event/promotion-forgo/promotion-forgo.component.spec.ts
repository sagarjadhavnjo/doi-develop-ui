import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionForgoComponent } from './promotion-forgo.component';

describe('PromotionForgoComponent', () => {
    let component: PromotionForgoComponent;
    let fixture: ComponentFixture<PromotionForgoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PromotionForgoComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PromotionForgoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
