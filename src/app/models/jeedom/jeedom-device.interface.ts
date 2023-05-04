import {JeedomCommandInterface} from './jeedom-command.interface';

export type JeedomDeviceType = "zigbee" | "sonos3"

export interface JeedomDeviceInterface {
  id: string
  name: string
  cmds: JeedomCommandInterface[]
  commant: ""
  eqType_name: JeedomDeviceType
  generic_type: null | string
  isEnable: "1"
  isVisible: "1"
}
