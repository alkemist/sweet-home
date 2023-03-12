import { BaseError } from '@app/errors/base.error';

export class NetworkError extends BaseError {
  override type = 'Network';
}
