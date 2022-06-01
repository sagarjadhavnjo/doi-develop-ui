import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCreationListComponent } from './post-creation-list.component';

describe('PostCreationListComponent', () => {
    let component: PostCreationListComponent;
    let fixture: ComponentFixture<PostCreationListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PostCreationListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PostCreationListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
