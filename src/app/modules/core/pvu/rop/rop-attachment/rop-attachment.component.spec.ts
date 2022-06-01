import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RopAttachmentComponent } from './rop-attachment.component';

describe('RopAttachmentComponent', () => {
    let component: RopAttachmentComponent;
    let fixture: ComponentFixture<RopAttachmentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RopAttachmentComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RopAttachmentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
