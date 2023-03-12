import { FirebaseError } from '@app/errors/firebase.error';

export class QuotaExceededError extends FirebaseError {
  override message = 'Quota exceeded';
}
