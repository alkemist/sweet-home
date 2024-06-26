import { ThermometerCommandValues } from '../thermometer.interface';
import { ThermometerHeimanParamValue } from './thermometer.type';

export interface ThermometerHeimanCommandValues extends ThermometerCommandValues {
  co2: number,
}

export interface ThermometerParameterValues extends Record<ThermometerHeimanParamValue | string, string | number | boolean | null> {
  co2: boolean,
  pression: boolean,
}
