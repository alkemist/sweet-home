import { NetworkError } from '@app/errors/network.error';

export class OfflineError extends NetworkError {
  override message = 'You are offline';
}
