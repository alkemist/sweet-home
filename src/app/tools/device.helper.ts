import {
  DeviceCategoryEnum,
  DeviceConfigurations,
  deviceConfigurations,
  DeviceConnectivityEnum,
  DeviceTypeEnum
} from '@models';

export abstract class DeviceHelper {
  static getConfigurations(
    connectivity: DeviceConnectivityEnum,
    category: DeviceCategoryEnum,
    type: DeviceTypeEnum,
  ): DeviceConfigurations | undefined {
    if (!deviceConfigurations[connectivity] || !deviceConfigurations[connectivity][category]) {
      return undefined;
    }

    return deviceConfigurations[connectivity]![category]![type];
  }
}
