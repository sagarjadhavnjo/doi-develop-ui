import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintEndDailogComponent } from './print-end-dailog.component';

describe('PrintEndDailogComponent', () => {
    let component: PrintEndDailogComponent;
    let fixture: ComponentFixture<PrintEndDailogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PrintEndDailogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PrintEndDailogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
