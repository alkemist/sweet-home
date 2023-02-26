import { LoggedError } from '@errors';

export class QuotaExceededError extends LoggedError<any> {
  override type = 'Database';
  override message = 'Quota exceeded';
}
