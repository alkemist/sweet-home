import { JeedomDeviceType } from './jeedom-device.interface';
import { JeedomCommandInterface } from './jeedom-command.interface';

export class JeedomDeviceModel {
  private readonly _id: number;

  constructor(
    _id: string,
    private _name: string,
    private _type: JeedomDeviceType,
    private _commands: JeedomCommandInterface[],
  ) {
    this._id = parseInt(_id, 10);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get type() {
    return this._type;
  }

  get commands() {
    return this._commands;
  }
}
