import { DeviceCommands } from '@devices';
import { ZigbeeBatteryCommandInfo } from './zigbee-battery-component.directive';
import { ZigbeeCommandInfo } from './zigbee-component.directive';

export const zigbeeInfoCommandFilters: DeviceCommands<ZigbeeCommandInfo> = {
  signal: { logicalId: 'linkquality' },
};

export const zigbeeBatteryInfoCommandFilters: DeviceCommands<ZigbeeBatteryCommandInfo> = {
  ...zigbeeInfoCommandFilters,
  battery: { generic_type: 'BATTERY' },
};
