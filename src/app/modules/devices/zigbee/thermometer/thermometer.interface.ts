import { ZigbeeBatteryCommandValues } from '../zigbee-battery-component.directive';

export interface ThermometerCommandValues extends ZigbeeBatteryCommandValues {
  temperature: number,
  humidity: number,
}

export interface ThermometerParameterValues extends Record<string, string | number | boolean | null> {
}
