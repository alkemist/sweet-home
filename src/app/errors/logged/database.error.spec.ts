import { DatabaseError } from '@app/errors';

describe('DatabaseError', () => {
  describe('DatabaseError.constructor', () => {
    it('should construct', () => {
      expect(new DatabaseError('message', { id: 'id' })).toBeDefined();
    });
  });
});
