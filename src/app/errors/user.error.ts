import { BaseError } from './base.error';

export class UserError extends BaseError {
  override type = 'User';
}
