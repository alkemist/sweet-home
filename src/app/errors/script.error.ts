import { BaseError } from './base.error';

export class ScriptError extends BaseError {
  override type = 'Script';
}
