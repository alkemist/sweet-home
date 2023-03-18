import { KeyValue } from '@angular/common';
import { DocumentBackInterface, DocumentFrontInterface } from './document.interface';
import { CoordinateInterface } from './coordinate.interface';
import { DeviceCategoryEnum, DeviceTypeEnum } from './device.enum';
import { HasIdWithInterface } from './id.interface';


export interface DeviceBackInterface extends DocumentBackInterface {
  position?: CoordinateInterface,
  category?: DeviceCategoryEnum | null,
  type?: DeviceTypeEnum | null,
  objectId?: number | null,
  commands?: Record<string, number>
}

export interface DeviceFrontInterface extends DocumentFrontInterface {
  position: CoordinateInterface,
  category: DeviceCategoryEnum | null,
  type: DeviceTypeEnum | null,
  objectId: number | null,
  commands: KeyValue<string, number>[]
}

export type DeviceStoredInterface = HasIdWithInterface<DeviceBackInterface>;
