import { ZigbeeCommandValues } from '../zigbee-component.directive';

export interface ZigbeePresenceCommandValues extends ZigbeeCommandValues {
  state: boolean,
}
