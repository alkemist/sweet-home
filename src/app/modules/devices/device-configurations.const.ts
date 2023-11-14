import {
  DeviceConfigurationBy,
  GlobalDeviceConfigurations,
  GlobalDeviceDefinitions,
  GroupedDeviceDefinitions
} from "./device-configurations.type";
import { DeviceCategoryEnum, DeviceConnectivityEnum, DeviceTypeEnum, PartialRecord } from "@models";
import {
  ChromecastParams,
  DeviceChromecastComponent,
  DeviceSonosComponent,
  MultimediaChromecastInfoCommandFilters,
  MultimediaParams,
  wifiMultimediaChromecastActionCommandFilters,
  wifiMultimediaSonosActionCommandFilters,
  wifiMultimediaSonosConfigurationFilters,
  wifiMultimediaSonosInfoCommandFilters
} from "./wifi";
import {
  DeviceOnOffLidlComponent,
  DeviceOnOffMoesComponent,
  DeviceOnOffNousComponent,
  DeviceOnOffSchneiderComponent,
  DeviceThermometerAqaraComponent,
  DeviceThermostatAqaraComponent,
  DeviceThermostatMoesComponent,
  OnOffParams, ThermometerParams,
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
import {
  zigbeeLinkerOnOffNousActionCommandFilters,
  zigbeeLinkerOnOffNousInfoCommandFilters
} from './zigbee/on-off/nous/on-off-nous.const';
import { Type } from '@angular/core';
import BaseDeviceComponent from '@base-device-component';
import { DeviceTestComponent } from './test.component';
import {
  LightParams,
  zigbeeLinkerLightActionCommandFilters,
  zigbeeLinkerLightInfoCommandFilters
} from './zigbee/light';
import { DeviceLightEgloComponent } from './zigbee/light/eglo/light-eglo.component';

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
        customParams: ThermometerParams,
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
        customParams: ThermometerParams,
      },
      [DeviceCategoryEnum.OnOff]: {
        infoCommandFilters: zigbeeLinkerOnOffInfoCommandFilters,
        customParams: OnOffParams,
      },
      [DeviceCategoryEnum.Light]: {
        infoCommandFilters: zigbeeLinkerLightInfoCommandFilters,
        actionCommandFilters: zigbeeLinkerLightActionCommandFilters,
        customParams: LightParams,
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
    [DeviceCategoryEnum.Light]: {
      [DeviceTypeEnum.Eglo]: {},
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
      [DeviceTypeEnum.Lidl]: {},
      [DeviceTypeEnum.Moes]: {
        actionCommandFilters: zigbeeLinkerOnOffMoesActionCommandFilters
      },
      [DeviceTypeEnum.Schneider]: {},
      [DeviceTypeEnum.Nous]: {
        infoCommandFilters: zigbeeLinkerOnOffNousInfoCommandFilters,
        actionCommandFilters: zigbeeLinkerOnOffNousActionCommandFilters
      }
    },
    [DeviceCategoryEnum.Light]: {
      [DeviceTypeEnum.Eglo]: {},
    },
    [DeviceCategoryEnum.Test]: {
      [DeviceTypeEnum.Test]: {}
    }
  }
}

export const ComponentClassByType: Record<DeviceCategoryEnum, Partial<Record<DeviceTypeEnum, Type<BaseDeviceComponent>>>> = {
  [DeviceCategoryEnum.Thermostat]: {
    [DeviceTypeEnum.Aqara]: DeviceThermostatAqaraComponent,
    [DeviceTypeEnum.Moes]: DeviceThermostatMoesComponent,
  },
  [DeviceCategoryEnum.Thermometer]: {
    [DeviceTypeEnum.Aqara]: DeviceThermometerAqaraComponent,
  },
  [DeviceCategoryEnum.OnOff]: {
    [DeviceTypeEnum.Lidl]: DeviceOnOffLidlComponent,
    [DeviceTypeEnum.Moes]: DeviceOnOffMoesComponent,
    [DeviceTypeEnum.Nous]: DeviceOnOffNousComponent,
    [DeviceTypeEnum.Schneider]: DeviceOnOffSchneiderComponent,
  },
  [DeviceCategoryEnum.Light]: {
    [DeviceTypeEnum.Eglo]: DeviceLightEgloComponent,
  },
  [DeviceCategoryEnum.Multimedia]: {
    [DeviceTypeEnum.Chromecast]: DeviceChromecastComponent,
    [DeviceTypeEnum.Sonos]: DeviceSonosComponent,
  },
  [DeviceCategoryEnum.Test]: {
    [DeviceTypeEnum.Test]: DeviceTestComponent,
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

