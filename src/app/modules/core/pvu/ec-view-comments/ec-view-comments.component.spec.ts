import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EcViewCommentsComponent } from './ec-view-comments.component';


describe('EcViewCommentsComponent', () => {
    let component: EcViewCommentsComponent;
    let fixture: ComponentFixture<EcViewCommentsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EcViewCommentsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EcViewCommentsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
