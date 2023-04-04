import { BaseError } from './base.error';

export class UnexpectedError extends BaseError {
  override type = 'Unexpected';

  constructor(public override message: string, public override context?: any) {
    super();
  }
}
