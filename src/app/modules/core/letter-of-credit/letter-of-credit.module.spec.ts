import { LetterOfCreditModule } from './letter-of-credit.module';

describe('LetterOfCreditModule', () => {
  let letterOfCreditModule: LetterOfCreditModule;

  beforeEach(() => {
    letterOfCreditModule = new LetterOfCreditModule();
  });

  it('should create an instance', () => {
    expect(letterOfCreditModule).toBeTruthy();
    
  });
});
