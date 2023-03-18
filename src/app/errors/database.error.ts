import { BaseError } from './base.error';

export class DatabaseError extends BaseError {
  override type = 'Database';

  constructor(private collectionName: string, message: string, public override context?: any) {
    super();
    this.message = `Document ["${ this.collectionName }"] ${ message }`;
  }
}
