import { BaseError } from './base.error';

export class NetworkError extends BaseError {
  override type = 'Network';
}
