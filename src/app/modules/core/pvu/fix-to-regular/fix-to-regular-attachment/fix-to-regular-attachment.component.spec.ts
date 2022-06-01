import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FixToRegularAttachmentComponent } from './fix-to-regular-attachment.component';



describe('StandingChargeAttachmentComponent', () => {
    let component: FixToRegularAttachmentComponent;
    let fixture: ComponentFixture<FixToRegularAttachmentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FixToRegularAttachmentComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FixToRegularAttachmentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
