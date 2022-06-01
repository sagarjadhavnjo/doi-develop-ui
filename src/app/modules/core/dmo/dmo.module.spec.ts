import { DmoModule } from './dmo.module';

describe('DmoModule', () => {
  let dmoModule: DmoModule;

  beforeEach(() => {
    dmoModule = new DmoModule();
  });

  it('should create an instance', () => {
    expect(dmoModule).toBeTruthy();
  });
});
