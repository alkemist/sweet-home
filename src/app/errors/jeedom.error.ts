import { BaseError } from './base.error';

export class JeedomError extends BaseError {
  override type = 'Jeedom';

  constructor(public override context?: any) {
    super();
  }
}
