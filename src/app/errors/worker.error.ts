import {BaseError} from './base.error';

export class WorkerError extends BaseError {
  override type = 'Worker';
}
