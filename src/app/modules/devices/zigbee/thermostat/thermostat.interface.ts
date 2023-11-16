import { ZigbeeBatteryCommandValues } from '../zigbee.interface';

export interface ThermostatCommandValues extends ZigbeeBatteryCommandValues {
  thermostat: number,
  room: number,
}
