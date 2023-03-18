import { NetworkError } from './network.error';

export class OfflineError extends NetworkError {
  override message = 'You are offline';
}
