import { UserError } from './user.error';

export class UserNotLoggedError extends UserError {
  override message = 'User has not logged';
}
