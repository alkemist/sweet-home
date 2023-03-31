import { JeedomError } from './jeedom.error';

export class JeedomRequestError extends JeedomError {
  override message = 'Jeedom Request Error';

  constructor(public override context: any) {
    super();
  }
}
