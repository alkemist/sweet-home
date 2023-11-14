import { LightEgloParamValue } from './light.type';

export interface ZigbeeLightEgloParameterValues extends Record<LightEgloParamValue | string, string | number | boolean | null> {
  temperatureMin: number, //153
  temperatureMax: number  //370
}
