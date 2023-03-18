import { DatabaseError } from './database.error';

export class DocumentNotFoundError extends DatabaseError {
  constructor(collectionName: string) {
    super(collectionName, 'not found');
  }
}
