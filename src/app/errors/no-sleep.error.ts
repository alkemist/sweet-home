import { BaseError } from './base.error';

export class NoSleepError extends BaseError {
  override type = 'NoSleep';

  constructor(public override context: any) {
    super();
  }
}
