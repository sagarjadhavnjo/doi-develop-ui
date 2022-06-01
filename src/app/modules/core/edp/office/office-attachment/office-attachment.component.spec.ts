import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeAttachmentComponent } from './office-attachment.component';

describe('OfficeAttachmentComponent', () => {
    let component: OfficeAttachmentComponent;
    let fixture: ComponentFixture<OfficeAttachmentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OfficeAttachmentComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OfficeAttachmentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
