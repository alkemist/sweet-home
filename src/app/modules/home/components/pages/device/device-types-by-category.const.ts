import { DeviceCategoryEnum, DeviceTypeEnum } from '@models';

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
