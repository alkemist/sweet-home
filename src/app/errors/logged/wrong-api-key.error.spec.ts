import { WrongApiKeyError } from '@app/errors';

describe('WrongApiKeyError', () => {
  describe('WrongApiKeyError.constructor', () => {
    it('should construct', () => {
      expect(new WrongApiKeyError()).toBeDefined();
    });
  });
});