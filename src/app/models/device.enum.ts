import { ThermostatAqaraComponent } from '../modules/devices/thermostats';
import { BaseDeviceComponent } from '../modules/devices/base-device.component';


export enum DeviceCategoryEnum {
  Thermostat = 'thermostat',
  Thermometer = 'thermometer',
  OnOff = 'on-off'
}

export enum DeviceTypeEnum {
  ThermostatAqara = 'thermostat-aqara',
  ThermostatMoes = 'thermostat-moes',
  PlugLidle = 'plug-lidle',
  ThermometerAqara = 'thermometer-aqara'
}

export const TypesByCategory: Record<DeviceCategoryEnum, DeviceTypeEnum[]> = {
  [DeviceCategoryEnum.Thermostat]: [
    DeviceTypeEnum.ThermostatMoes,
    DeviceTypeEnum.ThermostatAqara,
  ],
  [DeviceCategoryEnum.OnOff]: [
    DeviceTypeEnum.PlugLidle
  ],
  [DeviceCategoryEnum.Thermometer]: [
    DeviceTypeEnum.ThermometerAqara
  ]
}

interface ComponentClass {
  constructor: (new () => BaseDeviceComponent),
  class: typeof ThermostatAqaraComponent
}

export const ComponentClassByType: Record<DeviceTypeEnum, ComponentClass> = {
  [DeviceTypeEnum.ThermostatAqara]: { constructor: ThermostatAqaraComponent, class: ThermostatAqaraComponent },
  [DeviceTypeEnum.ThermostatMoes]: { constructor: ThermostatAqaraComponent, class: ThermostatAqaraComponent },
  [DeviceTypeEnum.PlugLidle]: { constructor: ThermostatAqaraComponent, class: ThermostatAqaraComponent },
  [DeviceTypeEnum.ThermometerAqara]: { constructor: ThermostatAqaraComponent, class: ThermostatAqaraComponent },
}
