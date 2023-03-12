import { UserError } from '@app/errors/user.error';

export class InvalidEmailError extends UserError {
  override message = 'Invalid email';
}
