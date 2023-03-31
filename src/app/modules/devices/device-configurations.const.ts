import { zigbeeOfficialOnOffActionCommandFilters, zigbeeOfficialOnOffInfoCommandFilters } from './on-off';
import {
  MultimediaChromecastInfoCommandFilters,
  MultimediaParams,
  wifiMultimediaChromecastActionCommandFilters,
  wifiMultimediaSonosActionCommandFilters,
  wifiMultimediaSonosConfigurationFilters,
  wifiMultimediaSonosInfoCommandFilters
} from './multimedia';
import {
  zigbeeOfficialThermostatActionCommandFilters,
  zigbeeOfficialThermostatAqaraInfoCommandFilters,
  zigbeeOfficialThermostatInfoCommandFilters,
  zigbeeOfficialThermostatMoesInfoCommandFilters
} from './thermostat';
import { DeviceCategoryEnum, DeviceConnectivityEnum, DeviceTypeEnum, PartialRecord } from '@models';

export interface DeviceDefinitions {
  infoCommandFilters?: Record<string, Record<string, string>>,
  actionCommandFilters?: Record<string, Record<string, string>>,
  configurationFilters?: Record<string, string>,
  customParams?: string[]
}

export interface DeviceConfigurations {
  infoCommandFilters: Record<string, Record<string, string>>,
  actionCommandFilters: Record<string, Record<string, string>>,
  configurationFilters: Record<string, string>,
  customParameters: string[]
}

export type DeviceDefinitionsBy<U extends string> = PartialRecord<U, DeviceDefinitions>;
export type DeviceConfigurationBy<U extends string> = PartialRecord<U, DeviceConfigurations>;
export type GroupedDeviceDefinitions<T extends string, U extends string> =
  Record<T, DeviceDefinitionsBy<U>>;
export type GlobalDeviceDefinitions<T extends string, U extends string, V extends string> =
  Record<T, PartialRecord<U, DeviceDefinitionsBy<V>>>;
export type GlobalDeviceConfigurations<T extends string, U extends string, V extends string> =
  Record<T, PartialRecord<U, DeviceConfigurationBy<V>>>;
export type DeviceCommands<E extends string> = Record<E, Record<string, string>>;
export type DeviceConfiguration<E extends string> = Record<E, string>;

export const deviceConfigurationsByConnectivityCategory: GroupedDeviceDefinitions<DeviceConnectivityEnum, DeviceCategoryEnum> =
  {
    [DeviceConnectivityEnum.Wifi]: {
      [DeviceCategoryEnum.Multimedia]: {
        customParams: MultimediaParams,
      },
    },
    [DeviceConnectivityEnum.ZigbeeOfficial]: {
      [DeviceCategoryEnum.Thermostat]: {
        infoCommandFilters: zigbeeOfficialThermostatInfoCommandFilters,
        actionCommandFilters: zigbeeOfficialThermostatActionCommandFilters,
      },
      [DeviceCategoryEnum.OnOff]: {
        infoCommandFilters: zigbeeOfficialOnOffInfoCommandFilters,
        actionCommandFilters: zigbeeOfficialOnOffActionCommandFilters,
      },
    },
    [DeviceConnectivityEnum.ZigbeeLinker]: {
      [DeviceCategoryEnum.Thermostat]: {
        infoCommandFilters: {},
        actionCommandFilters: {},
      },
      [DeviceCategoryEnum.OnOff]: {
        infoCommandFilters: {},
        actionCommandFilters: {},
      },
    }
  };

export const deviceDefinitionsByConnectivityCategoryType:
  GlobalDeviceDefinitions<DeviceConnectivityEnum, DeviceCategoryEnum, DeviceTypeEnum> = {
  [DeviceConnectivityEnum.Wifi]: {
    [DeviceCategoryEnum.Multimedia]: {
      [DeviceTypeEnum.Chromecast]: {
        infoCommandFilters: MultimediaChromecastInfoCommandFilters,
        actionCommandFilters: wifiMultimediaChromecastActionCommandFilters,
      },
      [DeviceTypeEnum.Sonos]: {
        infoCommandFilters: wifiMultimediaSonosInfoCommandFilters,
        actionCommandFilters: wifiMultimediaSonosActionCommandFilters,
        configurationFilters: wifiMultimediaSonosConfigurationFilters
      },
    }
  },
  [DeviceConnectivityEnum.ZigbeeOfficial]: {
    [DeviceCategoryEnum.Thermostat]: {
      [DeviceTypeEnum.ThermostatAqara]: {
        infoCommandFilters: zigbeeOfficialThermostatAqaraInfoCommandFilters,
      },
      [DeviceTypeEnum.ThermostatMoes]: {
        infoCommandFilters: zigbeeOfficialThermostatMoesInfoCommandFilters,
      },
    },
    [DeviceCategoryEnum.OnOff]: {
      [DeviceTypeEnum.PlugLidl]: {}
    }
  },
  [DeviceConnectivityEnum.ZigbeeLinker]: {
    [DeviceCategoryEnum.Thermostat]: {
      [DeviceTypeEnum.ThermostatAqara]: {
        infoCommandFilters: {},
        actionCommandFilters: {},
      },
      [DeviceTypeEnum.ThermostatMoes]: {
        infoCommandFilters: {},
        actionCommandFilters: {},
      },
    }
  }
}

const mergeDefinitions = ()
  : GlobalDeviceConfigurations<DeviceConnectivityEnum, DeviceCategoryEnum, DeviceTypeEnum> => {
  return Object.entries(deviceDefinitionsByConnectivityCategoryType).reduce(
    (resultByConnectivity, [ connectivityKey, deviceConfigurationsByCategory ]) => {
      resultByConnectivity[connectivityKey as DeviceConnectivityEnum] =
        Object.entries(deviceConfigurationsByCategory).reduce(
          (resultByCategory, [ categoryKey, deviceConfigurationsByType ]) => {
            resultByCategory[categoryKey as DeviceCategoryEnum] = Object.entries(deviceConfigurationsByType).reduce(
              (resultByType, [ typeKey, deviceConfigurationByTypes ]) => {
                const parent = deviceConfigurationsByConnectivityCategory[connectivityKey as DeviceConnectivityEnum][categoryKey as DeviceCategoryEnum];
                resultByType[typeKey as DeviceTypeEnum] = {
                  infoCommandFilters: {
                    ...parent?.infoCommandFilters,
                    ...deviceConfigurationByTypes.infoCommandFilters,
                  },
                  actionCommandFilters: {
                    ...parent?.actionCommandFilters,
                    ...deviceConfigurationByTypes.actionCommandFilters,
                  },
                  configurationFilters: {
                    ...parent?.configurationFilters,
                    ...deviceConfigurationByTypes.configurationFilters,
                  },
                  customParameters: [
                    ...parent?.customParams ?? [],
                    ...deviceConfigurationByTypes.customParams ?? [],
                  ],
                };
                return resultByType;
              }, {} as DeviceConfigurationBy<DeviceTypeEnum>
            );

            return resultByCategory;
          }, {} as PartialRecord<DeviceCategoryEnum, DeviceConfigurationBy<DeviceTypeEnum>>
        );

      return resultByConnectivity;
    }
    , {} as GlobalDeviceConfigurations<DeviceConnectivityEnum, DeviceCategoryEnum, DeviceTypeEnum>);
};

export const deviceConfigurations: GlobalDeviceConfigurations<DeviceConnectivityEnum, DeviceCategoryEnum, DeviceTypeEnum>
  = mergeDefinitions();

