import { ZigbeeCommandValues } from './zigbee-component.directive';

export interface ZigbeeBatteryCommandValues extends ZigbeeCommandValues {
  battery: number,
}
