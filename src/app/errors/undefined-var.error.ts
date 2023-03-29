import { ScriptError } from './script.error';

export class UndefinedVarError extends ScriptError {
  override message = 'Undefined variable';

  constructor(public override context: string) {
    super();
  }
}
