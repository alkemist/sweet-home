import { EmptyDocumentError } from '@app/errors';

describe('EmptyDocumentError', () => {
  describe('EmptyDocumentError.constructor', () => {
    it('should construct', () => {
      expect(new EmptyDocumentError('collectionName')).toBeDefined();
    });
  });
});