export enum DeviceConnectivityEnum {
  Wifi = 'wifi',
  ZigbeeOfficial = 'zigbee-official',
  ZigbeeLinker = 'zigbee-linker',
}

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


