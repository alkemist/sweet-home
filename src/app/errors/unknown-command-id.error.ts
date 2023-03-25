import { JeedomError } from './jeedom.error';

export class UnknownCommandIdError extends JeedomError {
  override message = 'Unknown command id';

  constructor(public override context: string) {
    super();
  }
}
