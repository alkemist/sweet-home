import { MapBuilder } from '@tools';
import { DeviceService } from '@services';
import { BaseDeviceComponent } from '../modules/devices/base-device.component';
import { DeviceThermostatAqaraComponent, DeviceThermostatMoesComponent } from '../modules/devices/thermostat';
import { DeviceOnOffPlugLidlComponent } from '../modules/devices/on-off';
import { DeviceChromecastComponent, DeviceSonosComponent } from '../modules/devices/multimedia';
import { DeviceTypeEnum } from './device.enum';
import { MessageService } from 'primeng/api';

type ComponentConstructor = (new (mP: MapBuilder, dS: DeviceService, mS: MessageService) => BaseDeviceComponent<string, string, string>);

export const ComponentClassByType: Record<DeviceTypeEnum, ComponentConstructor> = {
  [DeviceTypeEnum.ThermostatAqara]: DeviceThermostatAqaraComponent,
  [DeviceTypeEnum.ThermostatMoes]: DeviceThermostatMoesComponent,
  [DeviceTypeEnum.PlugLidl]: DeviceOnOffPlugLidlComponent,
  [DeviceTypeEnum.Chromecast]: DeviceChromecastComponent,
  [DeviceTypeEnum.Sonos]: DeviceSonosComponent,
}
