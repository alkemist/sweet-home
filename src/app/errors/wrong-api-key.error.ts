import { FirebaseError } from '@errors';

export class WrongApiKeyError extends FirebaseError {
  override message = 'Wrong Api Key';
}
