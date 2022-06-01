import { DesignationModule } from './designation.module';

describe('DesignationModule', () => {
  let designationModule: DesignationModule;

  beforeEach(() => {
    designationModule = new DesignationModule();
  });

  it('should create an instance', () => {
    expect(designationModule).toBeTruthy();
  });
});
