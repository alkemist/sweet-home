import { ZigbeeBatteryCommandValues } from '../zigbee.interface';

export interface ThermometerCommandValues extends ZigbeeBatteryCommandValues {
  temperature: number,
  humidity: number,
  pression: number,
  co2: number,
}

export interface ThermometerParameterValues extends Record<string, string | number | boolean | null> {
  pression: boolean,
  co2: boolean
}
