import { DataObjectInterface } from '@app/models/data-object.interface';

export interface Coordinate {
  x: number,
  y: number
}

export enum DeviceCategoryEnum {
  Thermostat = 'thermostat',
  Thermometer = 'thermometer',
  OnOff = 'on-off'
}

export enum DeviceTypeEnum {
  ThermostatAqara = 'thermostat-aqara',
  ThermostatMoes = 'thermostat-moes',
  PlugLidle = 'plug-lidle'
}

export interface DeviceInterface extends DataObjectInterface {
  position: Coordinate,
  category: DeviceCategoryEnum,
  type: DeviceTypeEnum,
}
