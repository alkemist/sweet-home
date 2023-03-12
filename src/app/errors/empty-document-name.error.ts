import { DatabaseError } from '@app/errors/database.error';

export class EmptyDocumentNameError extends DatabaseError {
  constructor(collectionName: string, context?: any) {
    super(collectionName, 'hasn\'t name', context);
  }
}
