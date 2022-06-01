import { TestBed } from '@angular/core/testing';
import { CommonWorkflowService } from './common-workflow.service';


describe('CommonWorkflowService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: CommonWorkflowService = TestBed.get(CommonWorkflowService);
        expect(service).toBeTruthy();
    });
});
