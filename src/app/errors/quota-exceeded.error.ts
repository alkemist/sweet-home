import { FirebaseError } from './firebase.error';

export class QuotaExceededError extends FirebaseError {
  override message = 'Quota exceeded';
}
