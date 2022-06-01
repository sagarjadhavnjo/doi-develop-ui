import { EdpModule } from './edp.module';

describe('EdpModule', () => {
  let edpModule: EdpModule;

  beforeEach(() => {
    edpModule = new EdpModule();
  });

  it('should create an instance', () => {
    expect(edpModule).toBeTruthy();
  });
});
