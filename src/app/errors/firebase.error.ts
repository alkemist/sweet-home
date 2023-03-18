import { BaseError } from './base.error';

export class FirebaseError extends BaseError {
  override type = 'Firebase';
}
