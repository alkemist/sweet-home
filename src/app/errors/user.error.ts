import { BaseError } from '@app/errors/base.error';

export class UserError extends BaseError {
  override type = 'User';
}
