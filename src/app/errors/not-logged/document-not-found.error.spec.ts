import { DocumentNotFoundError } from '@app/errors';

describe('DocumentNotFoundError', () => {
  describe('DocumentNotFoundError.constructor', () => {
    it('should construct', () => {
      expect(new DocumentNotFoundError('collectionName', { id: 'id' })).toBeDefined();
    });
  });
});
