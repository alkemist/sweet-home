import { KeyValue } from '@angular/common';
import { DocumentBackInterface, DocumentFrontInterface } from './document.interface';
import { CoordinateInterface } from './coordinate.interface';
import { DeviceCategoryEnum, DeviceConnectivityEnum, DeviceTypeEnum } from './device.enum';
import { HasIdWithInterface } from './id.interface';


export interface DeviceBackInterface extends DocumentBackInterface {
  connectivity?: DeviceConnectivityEnum | null,
  category?: DeviceCategoryEnum | null,
  type?: DeviceTypeEnum | null,
  jeedomId?: number | null,
  position?: CoordinateInterface,
  infoCommandIds?: Record<string, number>,
  actionCommandIds?: Record<string, number>
  paramValues?: Record<string, number | string>
}

export interface DeviceFrontInterface extends DocumentFrontInterface {
  connectivity: DeviceConnectivityEnum | null,
  category: DeviceCategoryEnum | null,
  type: DeviceTypeEnum | null,
  jeedomId: number | null,
  position: CoordinateInterface,
  infoCommandIds: KeyValue<string, number>[],
  actionCommandIds: KeyValue<string, number>[],
  paramValues: KeyValue<string, number | string>[],
}

export type DeviceStoredInterface = HasIdWithInterface<DeviceBackInterface>;
