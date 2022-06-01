import { DoiModule } from './doi.module';

describe('DoiModule', () => {
  let doiModule: DoiModule;

  beforeEach(() => {
    doiModule = new DoiModule();
  });

  it('should create an instance', () => {
    expect(doiModule).toBeTruthy();
  });
});
