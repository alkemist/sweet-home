import { FirebaseError } from '@errors';

export class TooManyRequestError extends FirebaseError {
  override message = 'Too many request';
}
