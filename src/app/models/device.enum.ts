import { ThermostatAqaraComponent, ThermostatMoesComponent } from '../modules/devices/thermostat';
import { BaseDeviceComponent } from '../modules/devices/base-device.component';
import { DeviceService } from '@services';
import { MapBuilder } from '@tools';
import { OnOffPlugLidlComponent } from '../modules/devices/on-off';


export enum DeviceCategoryEnum {
  Thermostat = 'thermostat',
  OnOff = 'on-off'
  //Thermometer = 'thermometer',
}

export enum DeviceTypeEnum {
  ThermostatAqara = 'thermostat-aqara',
  ThermostatMoes = 'thermostat-moes',
  PlugLidl = 'plug-lidle',
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
  /*[DeviceCategoryEnum.Thermometer]: [
    DeviceTypeEnum.ThermometerAqara
  ]*/
}

interface ComponentClass {
  constructor: (new (mP: MapBuilder, dS: DeviceService) => BaseDeviceComponent),
  class: typeof BaseDeviceComponent
}

export const ComponentClassByType: Record<DeviceTypeEnum, ComponentClass> = {
  [DeviceTypeEnum.ThermostatAqara]: { constructor: ThermostatAqaraComponent, class: ThermostatAqaraComponent },
  [DeviceTypeEnum.ThermostatMoes]: { constructor: ThermostatMoesComponent, class: ThermostatMoesComponent },
  [DeviceTypeEnum.PlugLidl]: { constructor: OnOffPlugLidlComponent, class: OnOffPlugLidlComponent },
  //[DeviceTypeEnum.ThermometerAqara]: { constructor: ThermostatAqaraComponent, class: ThermostatAqaraComponent },
}
