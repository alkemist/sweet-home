import { DataObjectInterface } from '@models';
import { LoggedError } from '@errors';

export class DatabaseError extends LoggedError<DataObjectInterface> {
  override type = 'Database';

  constructor(public override message: string, public override context: DataObjectInterface) {
    super();
  }
}
