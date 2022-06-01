import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShettyPayComponent } from './shetty-pay.component';

describe('ShettyPayComponent', () => {
    let component: ShettyPayComponent;
    let fixture: ComponentFixture<ShettyPayComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ShettyPayComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ShettyPayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
