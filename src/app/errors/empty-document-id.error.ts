import { DatabaseError } from '@app/errors/database.error';

export class EmptyDocumentIdError extends DatabaseError {
  constructor(collectionName: string, context?: any) {
    super(collectionName, 'hasn\'t id', context);
  }
}
