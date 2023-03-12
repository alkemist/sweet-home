import { DocumentBackInterface, DocumentFrontInterface } from '@app/models/document.interface';
import { CoordinateInterface } from '@app/models/coordinate.interface';
import { DeviceTypeEnum } from '@app/models/device-type.enum';
import { DeviceCategoryEnum } from '@app/models/device-category.enum';
import { KeyValue } from '@angular/common';
import { HasIdWithInterface } from '@app/models/id.interface';


export interface DeviceBackInterface extends DocumentBackInterface {
  position?: CoordinateInterface,
  category?: DeviceCategoryEnum | null,
  type?: DeviceTypeEnum | null,
  commands?: Record<string, number>
}

export interface DeviceFrontInterface extends DocumentFrontInterface {
  position: CoordinateInterface,
  category: DeviceCategoryEnum | null,
  type: DeviceTypeEnum | null,
  commands: KeyValue<string, number>[]
}

export type DeviceStoredInterface = HasIdWithInterface<DeviceBackInterface>;
