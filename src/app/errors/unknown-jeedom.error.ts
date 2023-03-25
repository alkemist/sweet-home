import { JeedomError } from './jeedom.error';

export class UnknownJeedomError extends JeedomError {
  override message = 'Unknown error';

  constructor(public override context: any) {
    super();
  }
}
