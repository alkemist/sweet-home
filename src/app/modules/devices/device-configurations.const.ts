import {
  DeviceConfigurationBy,
  GlobalDeviceConfigurations,
  GlobalDeviceDefinitions,
  GroupedDeviceDefinitions
} from "./device-configurations.type";
import { DeviceCategoryEnum, DeviceConnectivityEnum, DeviceTypeEnum, PartialRecord } from "@models";
import {
  ChromecastParams,
  MultimediaChromecastInfoCommandFilters,
  MultimediaParams,
  wifiMultimediaChromecastActionCommandFilters,
  wifiMultimediaSonosActionCommandFilters,
  wifiMultimediaSonosConfigurationFilters,
  wifiMultimediaSonosInfoCommandFilters
} from "./wifi";
import {
  OnOffParams,
  zigbeeLinkerOnOffInfoCommandFilters,
  zigbeeLinkerOnOffMoesActionCommandFilters,
  zigbeeLinkerThermometerInfoCommandFilters,
  zigbeeLinkerThermostatActionCommandFilters,
  zigbeeLinkerThermostatInfoCommandFilters,
  zigbeeOfficialOnOffActionCommandFilters,
  zigbeeOfficialOnOffInfoCommandFilters,
  zigbeeOfficialThermometerInfoCommandFilters,
  zigbeeOfficialThermostatActionCommandFilters,
  zigbeeOfficialThermostatAqaraInfoCommandFilters,
  zigbeeOfficialThermostatInfoCommandFilters,
  zigbeeOfficialThermostatMoesInfoCommandFilters
} from "./zigbee";
import { zigbeeLinkerOnOffLidlActionCommandFilters } from './zigbee/on-off/lidl/on-off-lidl.const';
import {
  zigbeeLinkerOnOffNousActionCommandFilters,
  zigbeeLinkerOnOffNousInfoCommandFilters
} from './zigbee/on-off/nous/on-off-nous.const';
import { zigbeeLinkerOnOffLSchneiderActionCommandFilters } from './zigbee/on-off/schneider/on-off-schneider.const';

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
      [DeviceCategoryEnum.Thermometer]: {
        infoCommandFilters: zigbeeOfficialThermometerInfoCommandFilters,
      },
      [DeviceCategoryEnum.OnOff]: {
        infoCommandFilters: zigbeeOfficialOnOffInfoCommandFilters,
        actionCommandFilters: zigbeeOfficialOnOffActionCommandFilters,
      },
    },
    [DeviceConnectivityEnum.ZigbeeLinker]: {
      [DeviceCategoryEnum.Thermostat]: {
        infoCommandFilters: zigbeeLinkerThermostatInfoCommandFilters,
        actionCommandFilters: zigbeeLinkerThermostatActionCommandFilters,
      },
      [DeviceCategoryEnum.Thermometer]: {
        infoCommandFilters: zigbeeLinkerThermometerInfoCommandFilters,
      },
      [DeviceCategoryEnum.OnOff]: {
        infoCommandFilters: zigbeeLinkerOnOffInfoCommandFilters,
        customParams: OnOffParams,
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
        customParams: ChromecastParams,
      },
      [DeviceTypeEnum.Sonos]: {
        infoCommandFilters: wifiMultimediaSonosInfoCommandFilters,
        actionCommandFilters: wifiMultimediaSonosActionCommandFilters,
        configurationFilters: wifiMultimediaSonosConfigurationFilters
      },
    },
    [DeviceCategoryEnum.Test]: {
      [DeviceTypeEnum.Test]: {
        infoCommandFilters: {},
        actionCommandFilters: {},
        configurationFilters: {}
      }
    }
  },
  [DeviceConnectivityEnum.ZigbeeOfficial]: {
    [DeviceCategoryEnum.Thermostat]: {
      [DeviceTypeEnum.Aqara]: {
        infoCommandFilters: zigbeeOfficialThermostatAqaraInfoCommandFilters,
      },
      [DeviceTypeEnum.Moes]: {
        infoCommandFilters: zigbeeOfficialThermostatMoesInfoCommandFilters,
      },
    },
    [DeviceCategoryEnum.Thermometer]: {
      [DeviceTypeEnum.Aqara]: {}
    },
    [DeviceCategoryEnum.OnOff]: {
      [DeviceTypeEnum.Lidl]: {},
      [DeviceTypeEnum.Moes]: {},
      [DeviceTypeEnum.Nous]: {},
      [DeviceTypeEnum.Schneider]: {}
    },
    [DeviceCategoryEnum.Test]: {
      [DeviceTypeEnum.Test]: {
        infoCommandFilters: {},
        actionCommandFilters: {},
        configurationFilters: {}
      }
    }
  },
  [DeviceConnectivityEnum.ZigbeeLinker]: {
    [DeviceCategoryEnum.Thermostat]: {
      [DeviceTypeEnum.Aqara]: {
        infoCommandFilters: {},
        actionCommandFilters: {},
      },
      [DeviceTypeEnum.Moes]: {
        infoCommandFilters: {},
        actionCommandFilters: {},
      },
    },
    [DeviceCategoryEnum.Thermometer]: {
      [DeviceTypeEnum.Aqara]: {}
    },
    [DeviceCategoryEnum.OnOff]: {
      [DeviceTypeEnum.Lidl]: {
        actionCommandFilters: zigbeeLinkerOnOffLidlActionCommandFilters
      },
      [DeviceTypeEnum.Moes]: {
        actionCommandFilters: zigbeeLinkerOnOffMoesActionCommandFilters
      },
      [DeviceTypeEnum.Schneider]: {
        actionCommandFilters: zigbeeLinkerOnOffLSchneiderActionCommandFilters
      },
      [DeviceTypeEnum.Nous]: {
        infoCommandFilters: zigbeeLinkerOnOffNousInfoCommandFilters,
        actionCommandFilters: zigbeeLinkerOnOffNousActionCommandFilters
      }
    },
    [DeviceCategoryEnum.Test]: {
      [DeviceTypeEnum.Test]: {}
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

