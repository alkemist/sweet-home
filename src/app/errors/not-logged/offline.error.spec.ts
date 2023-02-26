import { OfflineError } from '@app/errors';

describe('OfflineError', () => {
  describe('OfflineError.constructor', () => {
    it('should construct', () => {
      expect(new OfflineError()).toBeDefined();
    });
  });
});