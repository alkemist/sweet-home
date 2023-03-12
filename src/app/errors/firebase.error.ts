import { BaseError } from '@app/errors/base.error';

export class FirebaseError extends BaseError {
  override type = 'Firebase';
}
