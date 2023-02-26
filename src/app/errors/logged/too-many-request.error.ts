import { LoggedError } from '@errors';

export class TooManyRequestError extends LoggedError<any> {
  override type = 'Database';
  override message = 'Too many request';
}
