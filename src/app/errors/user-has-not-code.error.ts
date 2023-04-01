import { UserError } from './user.error';

export class UserHasNotCodeError extends UserError {
  override message = 'User has not code';
}
