import { DocumentInterface } from '@models';
import { LoggedError } from '@errors';

export class DatabaseError extends LoggedError<DocumentInterface> {
  override type = 'Database';

  constructor(public override message: string, public override context: DocumentInterface) {
    super();
  }
}
