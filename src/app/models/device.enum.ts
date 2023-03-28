import { DeviceThermostatAqaraComponent, DeviceThermostatMoesComponent } from '../modules/devices/thermostat';
import { BaseDeviceComponent } from '../modules/devices/base-device.component';
import { DeviceService } from '@services';
import { MapBuilder } from '@tools';
import { DeviceOnOffPlugLidlComponent } from '../modules/devices/on-off';
import { DeviceChromecastComponent, DeviceSonosComponent } from '../modules/devices/multimedia';


export enum DeviceCategoryEnum {
  Thermostat = 'thermostat',
  OnOff = 'on-off',
  Multimedia = 'multimedia'
  //Thermometer = 'thermometer',
}

export enum DeviceTypeEnum {
  ThermostatAqara = 'thermostat-aqara',
  ThermostatMoes = 'thermostat-moes',
  PlugLidl = 'plug-lidle',
  Chromecast = 'chromecast',
  Sonos = 'sonos',
  //ThermometerAqara = 'thermometer-aqara'
}

export const TypesByCategory: Record<DeviceCategoryEnum, DeviceTypeEnum[]> = {
  [DeviceCategoryEnum.Thermostat]: [
    DeviceTypeEnum.ThermostatMoes,
    DeviceTypeEnum.ThermostatAqara,
  ],
  [DeviceCategoryEnum.OnOff]: [
    DeviceTypeEnum.PlugLidl
  ],
  [DeviceCategoryEnum.Multimedia]: [
    DeviceTypeEnum.Chromecast,
    DeviceTypeEnum.Sonos,
  ],
  /*[DeviceCategoryEnum.Thermometer]: [
    DeviceTypeEnum.ThermometerAqara
  ]*/
}

interface ComponentClass {
  constructor: (new (mP: MapBuilder, dS: DeviceService) => BaseDeviceComponent<string, string, string>),
  class: typeof BaseDeviceComponent<string, string, string>
}

export const ComponentClassByType: Record<DeviceTypeEnum, ComponentClass> = {
  [DeviceTypeEnum.ThermostatAqara]: {
    constructor: DeviceThermostatAqaraComponent,
    class: DeviceThermostatAqaraComponent
  },
  [DeviceTypeEnum.ThermostatMoes]: { constructor: DeviceThermostatMoesComponent, class: DeviceThermostatMoesComponent },
  [DeviceTypeEnum.PlugLidl]: { constructor: DeviceOnOffPlugLidlComponent, class: DeviceOnOffPlugLidlComponent },
  [DeviceTypeEnum.Chromecast]: { constructor: DeviceChromecastComponent, class: DeviceChromecastComponent },
  [DeviceTypeEnum.Sonos]: { constructor: DeviceSonosComponent, class: DeviceSonosComponent },
  //[DeviceTypeEnum.ThermometerAqara]: { constructor: ThermostatAqaraComponent, class: ThermostatAqaraComponent },
}
