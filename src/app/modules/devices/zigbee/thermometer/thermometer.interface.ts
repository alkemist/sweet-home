import { ZigbeeBatteryCommandValues } from '../zigbee-battery-component.directive';
import { OnOffParamValue } from '@devices';

export interface ThermometerCommandValues extends ZigbeeBatteryCommandValues {
  temperature: number,
  humidity: number,
  pression: number,
}

export interface ThermometerParameterValues extends Record<OnOffParamValue | string, string | number | boolean | null> {
  pression: boolean,
}
