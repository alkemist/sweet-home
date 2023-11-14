import { ZigbeeCommandValues } from '../zigbee-component.directive';
import { LightParamValue } from './light.type';

export interface ZigbeeLightCommandValues extends ZigbeeCommandValues {
  state: boolean,
  brightness: number,
  temperature: number,
  color: string,
}

export interface ZigbeeLightParameterValues extends Record<LightParamValue | string, string | number | boolean | null> {

}
