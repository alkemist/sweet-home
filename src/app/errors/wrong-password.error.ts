import { UserError } from '@app/errors/user.error';

export class WrongPasswordError extends UserError {
  override message = 'Wrong password';
}
