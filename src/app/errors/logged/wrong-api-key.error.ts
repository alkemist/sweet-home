import { LoggedError } from '@errors';

export class WrongApiKeyError extends LoggedError<void> {
  override message = 'Wrong Api Key';
}
