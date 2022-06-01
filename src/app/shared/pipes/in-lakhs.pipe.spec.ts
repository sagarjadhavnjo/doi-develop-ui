import { InLakhsPipe } from './in-lakhs.pipe';

describe('InLakhsPipe', () => {
  it('create an instance', () => {
    const pipe = new InLakhsPipe();
    expect(pipe).toBeTruthy();
  });
});
