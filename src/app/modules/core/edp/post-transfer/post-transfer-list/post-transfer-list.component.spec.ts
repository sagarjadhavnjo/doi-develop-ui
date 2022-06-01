import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTransferListComponent } from './post-transfer-list.component';

describe('PostTransferListComponent', () => {
    let component: PostTransferListComponent;
    let fixture: ComponentFixture<PostTransferListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PostTransferListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PostTransferListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
