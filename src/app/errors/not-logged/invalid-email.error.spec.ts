import { InvalidEmailError } from '@app/errors';

describe('InvalidEmailError', () => {
  describe('InvalidEmailError.constructor', () => {
    it('should construct', () => {
      expect(new InvalidEmailError()).toBeDefined();
    });
  });
});