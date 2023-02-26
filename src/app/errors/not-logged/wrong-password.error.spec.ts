import { WrongPasswordError } from '@app/errors';

describe('WrongPasswordError', () => {
  describe('WrongPasswordError.constructor', () => {
    it('should construct', () => {
      expect(new WrongPasswordError()).toBeDefined();
    });
  });
});