import { NotFoundUploadError } from '@app/errors';

describe('NotFoundUploadError', () => {
  describe('NotFoundUploadError.constructor', () => {
    it('should construct', () => {
      expect(new NotFoundUploadError('context')).toBeDefined();
    });
  });
});