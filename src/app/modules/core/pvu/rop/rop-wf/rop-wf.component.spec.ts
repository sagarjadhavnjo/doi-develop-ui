import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RopWfComponent } from './rop-wf.component';


describe('RopWfComponent', () => {
    let component: RopWfComponent;
    let fixture: ComponentFixture<RopWfComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RopWfComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RopWfComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
