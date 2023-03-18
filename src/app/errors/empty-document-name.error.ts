import { DatabaseError } from './database.error';

export class EmptyDocumentNameError extends DatabaseError {
  constructor(collectionName: string, context?: any) {
    super(collectionName, 'hasn\'t name', context);
  }
}
