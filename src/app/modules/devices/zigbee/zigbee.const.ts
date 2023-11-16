import { DeviceCommands } from '@devices';
import { ZigbeeCommandInfo } from './zigbee-component.directive';
import { ZigbeeBatteryCommandInfo } from './zigbee.type';

export const zigbeeInfoCommandFilters: DeviceCommands<ZigbeeCommandInfo> = {
  signal: { logicalId: 'linkquality' },
};

export const zigbeeBatteryInfoCommandFilters: DeviceCommands<ZigbeeBatteryCommandInfo> = {
  ...zigbeeInfoCommandFilters,
  battery: { generic_type: 'BATTERY' },
};
