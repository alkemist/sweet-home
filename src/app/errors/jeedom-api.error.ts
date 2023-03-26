import { JeedomError } from './jeedom.error';

export class JeedomApiError extends JeedomError {
  override message = 'Jeedom API Error';

  constructor(public override context: any) {
    super();
  }
}
