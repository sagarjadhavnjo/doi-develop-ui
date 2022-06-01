import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RopCommentsComponent } from './rop-comments.component';


describe('RopCommentsComponent', () => {
    let component: RopCommentsComponent;
    let fixture: ComponentFixture<RopCommentsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RopCommentsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RopCommentsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
