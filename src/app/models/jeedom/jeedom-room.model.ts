import {JeedomDeviceModel} from './jeedom-device.model';

export class JeedomRoomModel {
  constructor(
    private _id: string,
    private _name: string,
    private _devices: JeedomDeviceModel[]
  ) {
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get devices() {
    return this._devices;
  }
}
