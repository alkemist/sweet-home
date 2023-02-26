import { UploadError } from '@app/errors';

describe('UploadError', () => {
  describe('UploadError.constructor', () => {
    it('should construct', () => {
      expect(new UploadError({} as File)).toBeDefined();
    });
  });
});