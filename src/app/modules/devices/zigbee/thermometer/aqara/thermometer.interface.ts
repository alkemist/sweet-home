import { ThermometerCommandValues } from '../thermometer.interface';
import { ThermometerAqaraParamValue } from './thermometer.type';

export interface ThermometerAqaraCommandValues extends ThermometerCommandValues {
  pression: number,
}

export interface ThermometerParameterValues extends Record<ThermometerAqaraParamValue | string, string | number | boolean | null> {
  pression: boolean,
  co2: boolean,
}
