import { UserError } from './user.error';

export class UserHasNotTokenError extends UserError {
  override message = 'User has not token';
}
