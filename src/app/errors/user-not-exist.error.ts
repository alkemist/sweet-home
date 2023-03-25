import { UserError } from './user.error';

export class UserNotExistError extends UserError {
  override message = 'User has not exist in user database';
}
