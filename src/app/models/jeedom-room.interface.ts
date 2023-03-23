import { JeedomDeviceInterface } from './jeedom-device.interface';

export interface JeedomRoomInterface {
  id: string
  name: string
  isVisible: "1"
  configuration: {},
  father_id: string,
  eqLogics: JeedomDeviceInterface[]
}
