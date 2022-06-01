import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintRemarksHistoryDailogComponent } from './print-remarks-history-dailog.component';

describe('PrintRemarksHistoryDailogComponent', () => {
    let component: PrintRemarksHistoryDailogComponent;
    let fixture: ComponentFixture<PrintRemarksHistoryDailogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PrintRemarksHistoryDailogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PrintRemarksHistoryDailogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
