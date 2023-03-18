import { UserError } from './user.error';

export class InvalidEmailError extends UserError {
  override message = 'Invalid email';
}
