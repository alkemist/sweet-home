import { DatabaseError } from './database.error';

export class EmptyDocumentIdError extends DatabaseError {
  constructor(collectionName: string, context?: any) {
    super(collectionName, 'hasn\'t id', context);
  }
}
