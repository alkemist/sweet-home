import {JeedomDeviceInterface} from '../';

export interface JeedomRoomInterface {
  id: string
  name: string
  isVisible: "1"
  configuration: {},
  father_id: string,
  eqLogics: JeedomDeviceInterface[]
}
