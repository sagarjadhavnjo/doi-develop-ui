import { NonAuthModule } from './non-auth.module';

describe('NonAuthModule', () => {
    let nonAuthModule: NonAuthModule;

    beforeEach(() => {
        nonAuthModule = new NonAuthModule();
    });

    it('should create an instance', () => {
        expect(nonAuthModule).toBeTruthy();
    });
});
