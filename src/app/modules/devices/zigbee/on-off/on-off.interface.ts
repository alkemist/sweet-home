import { ZigbeeCommandValues } from '../zigbee-component.directive';
import { OnOffParamValue } from '@devices';

export interface ZigbeeOnOffCommandValues extends ZigbeeCommandValues {
  state: boolean,
}

export interface OnOffParameterValues extends Record<OnOffParamValue | string, string | number | boolean | null> {
  security: boolean,
  icon: string
}
