import { KeyValue } from '@angular/common';
import { DocumentFrontInterface } from '../document';
import { CoordinateInterface } from '../coordinate';
import { DeviceCategoryEnum, DeviceConnectivityEnum, DeviceTypeEnum } from './device.enum';
import { DocumentInterface } from '@alkemist/ngx-data-store';

export interface DeviceFrontInterface extends DocumentFrontInterface {
  connectivity: DeviceConnectivityEnum | null,
  category: DeviceCategoryEnum | null,
  type: DeviceTypeEnum | null,
  jeedomId: number | null,
  position?: CoordinateInterface,
  positionX?: number | null,
  positionY?: number | null,
  infoCommandIds: KeyValue<string, number>[],
  actionCommandIds: KeyValue<string, number>[],
  configurationValues: KeyValue<string, string>[],
  parameterValues: KeyValue<string, string>[],
}

export interface DeviceBackInterface extends DocumentInterface {
  name: string,
  connectivity: DeviceConnectivityEnum,
  connectivityLabel?: string,
  category: DeviceCategoryEnum,
  categoryLabel?: string,
  type: DeviceTypeEnum,
  typeLabel?: string,
  jeedomId: number | null,
  positionX?: number | null,
  positionY?: number | null,
  infoCommandIds: Record<string, number>,
  actionCommandIds: Record<string, number>,
  configurationValues: Record<string, string>,
  parameterValues: Record<string, string>,
}
