import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTransferComponent } from './post-transfer.component';

describe('PostTransferComponent', () => {
    let component: PostTransferComponent;
    let fixture: ComponentFixture<PostTransferComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PostTransferComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PostTransferComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
