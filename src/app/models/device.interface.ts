import { DocumentBackInterface, DocumentFrontInterface } from '@app/models/document.interface';
import { CoordinateInterface } from '@app/models/coordinate.interface';
import { DeviceCategoryEnum, DeviceTypeEnum } from '@app/models/device.enum';
import { HasIdWithInterface } from '@app/models/id.interface';
import { KeyValue } from '@angular/common';


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
