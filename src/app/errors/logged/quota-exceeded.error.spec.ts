import { QuotaExceededError } from '@app/errors';

describe('QuotaExceededError', () => {
  describe('QuotaExceededError.constructor', () => {
    it('should construct', () => {
      expect(new QuotaExceededError()).toBeDefined();
    });
  });
});