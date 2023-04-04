import { DeviceCategoryEnum, DeviceTypeEnum } from '@models';

export const TypesByCategory: Record<DeviceCategoryEnum, DeviceTypeEnum[]> = {
  [DeviceCategoryEnum.Thermostat]: [
    DeviceTypeEnum.Moes,
    DeviceTypeEnum.Aqara,
  ],
  [DeviceCategoryEnum.OnOff]: [
    DeviceTypeEnum.Lidl
  ],
  [DeviceCategoryEnum.Multimedia]: [
    DeviceTypeEnum.Chromecast,
    DeviceTypeEnum.Sonos,
  ],
  [DeviceCategoryEnum.Thermometer]: [
    DeviceTypeEnum.Aqara,
  ]
}
