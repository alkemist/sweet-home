import { OnOffParamValue } from '@devices';
import { ThermometerCommandValues } from '../thermometer.interface';

export interface ThermometerAqaraCommandValues extends ThermometerCommandValues {
  pression: number,
}

export interface ThermometerParameterValues extends Record<OnOffParamValue | string, string | number | boolean | null> {
  pression: boolean,
}
