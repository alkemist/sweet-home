import { UserError } from './user.error';

export class WrongPasswordError extends UserError {
  override message = 'Wrong password';
}
