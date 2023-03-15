import { BaseDeviceComponent } from '@app/modules/devices/device.component';
import { ThermostatAqaraComponent } from '@app/modules/devices/thermostats';

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

export const CommandsByType: Record<DeviceTypeEnum, string[]> = {
  [DeviceTypeEnum.ThermostatAqara]: [
    'THERMOSTAT_TEMPERATURE',
    'THERMOSTAT_SETPOINT'
  ],
  [DeviceTypeEnum.ThermostatMoes]: [],
  [DeviceTypeEnum.PlugLidle]: [],
  [DeviceTypeEnum.ThermometerAqara]: [
    'TEMPERATURE',
    'HUMIDITY'
  ]
}

export const ComponentByType: Record<DeviceTypeEnum, BaseDeviceComponent> = {
  [DeviceTypeEnum.ThermostatAqara]: ThermostatAqaraComponent,
  [DeviceTypeEnum.ThermostatMoes]: ThermostatAqaraComponent,
  [DeviceTypeEnum.PlugLidle]: ThermostatAqaraComponent,
  [DeviceTypeEnum.ThermometerAqara]: ThermostatAqaraComponent,
}
