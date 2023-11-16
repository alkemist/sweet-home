import { JeedomHistoryInterface } from '../jeedom/jeedom-history.interface';

export interface DeviceCommandHistory {
  deviceName: string;
  commandId: number;
  commandName: string;
  history: JeedomHistoryInterface[]
}
