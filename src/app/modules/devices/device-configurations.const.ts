import {
  DeviceConfigurationBy,
  GlobalDeviceConfigurations,
  GlobalDeviceDefinitions,
  GroupedDeviceDefinitions
} from "./device-configurations.type";
import { DeviceCategoryEnum, DeviceConnectivityEnum, DeviceTypeEnum, PartialRecord } from "@models";
import {
  AndroidParams,
  ChromecastParams,
  DeviceAndroidComponent,
  DeviceChromecastComponent,
  DeviceSonosComponent,
  MultimediaAndroidInfoCommandFilters,
  MultimediaChromecastInfoCommandFilters,
  MultimediaParams,
  wifiMultimediaAndroidActionCommandFilters,
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
  DevicePresenceSonoffComponent,
  DeviceThermometerAqaraComponent,
  DeviceThermostatAqaraComponent,
  DeviceThermostatMoesComponent,
  OnOffParams,
  zigbeeLinkerOnOffInfoCommandFilters,
  zigbeeLinkerOnOffMoesActionCommandFilters,
  zigbeeLinkerPresenceInfoCommandFilters,
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
  phillipsHueLightActionCommandFilters,
  phillipsHueLightInfoCommandFilters,
  zigbeeLinkerLightActionCommandFilters,
  zigbeeLinkerLightInfoCommandFilters
} from './zigbee/light';
import { DeviceLightEgloComponent } from './zigbee/light/eglo/light-eglo.component';
import {
  ThermometerAqaraParams,
  zigbeeLinkerThermometerInfoAqaraCommandFilters,
  zigbeeOfficialThermometerAqaraInfoCommandFilters
} from './zigbee/thermometer/aqara/thermometer.const';
import { DeviceThermometerSonoffComponent } from './zigbee/thermometer/sonoff/thermometer-sonoff.component';
import { DeviceLightPhilipsComponent } from './zigbee/light/philips/light-philips.component';
import { LightEgloParams } from './zigbee/light/eglo/light-eglo.const';
import { zigbeeLinkerOnOffSchneiderActionCommandFilters } from './zigbee/on-off/schneider/on-off-schneider.const';

export const deviceConfigurationsByConnectivityCategory: GroupedDeviceDefinitions<DeviceConnectivityEnum, DeviceCategoryEnum> =
  {
    [DeviceConnectivityEnum.Wifi]: {
      [DeviceCategoryEnum.Multimedia]: {
        customParams: MultimediaParams,
      },
    },
    [DeviceConnectivityEnum.PhillipsHue]: {
      [DeviceCategoryEnum.Light]: {
        infoCommandFilters: phillipsHueLightInfoCommandFilters,
        actionCommandFilters: phillipsHueLightActionCommandFilters,
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
      [DeviceCategoryEnum.Light]: {
        infoCommandFilters: zigbeeLinkerLightInfoCommandFilters,
        actionCommandFilters: zigbeeLinkerLightActionCommandFilters,
      },
      [DeviceCategoryEnum.Presence]: {
        infoCommandFilters: zigbeeLinkerPresenceInfoCommandFilters,
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
      [DeviceTypeEnum.Android]: {
        infoCommandFilters: MultimediaAndroidInfoCommandFilters,
        actionCommandFilters: wifiMultimediaAndroidActionCommandFilters,
        customParams: AndroidParams,
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
  [DeviceConnectivityEnum.PhillipsHue]: {
    [DeviceCategoryEnum.Light]: {
      [DeviceTypeEnum.Philips]: {
        infoCommandFilters: {},
        actionCommandFilters: {},
        configurationFilters: {}
      }
    },
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
      [DeviceTypeEnum.Aqara]: {
        infoCommandFilters: zigbeeOfficialThermometerAqaraInfoCommandFilters,
        customParams: ThermometerAqaraParams,
      },
      [DeviceTypeEnum.Sonoff]: {}
    },
    [DeviceCategoryEnum.OnOff]: {
      [DeviceTypeEnum.Lidl]: {},
      [DeviceTypeEnum.Moes]: {},
      [DeviceTypeEnum.Nous]: {},
      [DeviceTypeEnum.Schneider]: {}
    },
    [DeviceCategoryEnum.Light]: {
      [DeviceTypeEnum.Eglo]: {
        customParams: LightEgloParams,
      },
      [DeviceTypeEnum.Philips]: {},
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
      [DeviceTypeEnum.Aqara]: {
        infoCommandFilters: zigbeeLinkerThermometerInfoAqaraCommandFilters,
        customParams: ThermometerAqaraParams,
      },
      [DeviceTypeEnum.Sonoff]: {}
    },
    [DeviceCategoryEnum.OnOff]: {
      [DeviceTypeEnum.Lidl]: {},
      [DeviceTypeEnum.Moes]: {
        actionCommandFilters: zigbeeLinkerOnOffMoesActionCommandFilters
      },
      [DeviceTypeEnum.Schneider]: {
        actionCommandFilters: zigbeeLinkerOnOffSchneiderActionCommandFilters
      },
      [DeviceTypeEnum.Nous]: {
        infoCommandFilters: zigbeeLinkerOnOffNousInfoCommandFilters,
        actionCommandFilters: zigbeeLinkerOnOffNousActionCommandFilters
      }
    },
    [DeviceCategoryEnum.Light]: {
      [DeviceTypeEnum.Eglo]: {
        customParams: LightEgloParams,
      },
      [DeviceTypeEnum.Philips]: {},
    },
    [DeviceCategoryEnum.Presence]: {
      [DeviceTypeEnum.Sonoff]: {},
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
    [DeviceTypeEnum.Sonoff]: DeviceThermometerSonoffComponent,
  },
  [DeviceCategoryEnum.OnOff]: {
    [DeviceTypeEnum.Lidl]: DeviceOnOffLidlComponent,
    [DeviceTypeEnum.Moes]: DeviceOnOffMoesComponent,
    [DeviceTypeEnum.Nous]: DeviceOnOffNousComponent,
    [DeviceTypeEnum.Schneider]: DeviceOnOffSchneiderComponent,
  },
  [DeviceCategoryEnum.Light]: {
    [DeviceTypeEnum.Eglo]: DeviceLightEgloComponent,
    [DeviceTypeEnum.Philips]: DeviceLightPhilipsComponent,
  },
  [DeviceCategoryEnum.Multimedia]: {
    [DeviceTypeEnum.Chromecast]: DeviceChromecastComponent,
    [DeviceTypeEnum.Android]: DeviceAndroidComponent,
    [DeviceTypeEnum.Sonos]: DeviceSonosComponent,
  },
  [DeviceCategoryEnum.Presence]: {
    [DeviceTypeEnum.Sonoff]: DevicePresenceSonoffComponent,
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

