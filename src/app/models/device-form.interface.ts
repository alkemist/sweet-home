import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CoordinateFormInterface } from './coordinate-form.interface';
import { KeyValueFormInterface } from './key-value-form.interface';
import { DeviceCategoryEnum, DeviceTypeEnum } from './device.enum';
import { DocumentFormInterface } from './document-form.interface';

export interface DeviceFormInterface extends DocumentFormInterface {
  jeedomId?: FormControl<number | null>
  position: FormGroup<CoordinateFormInterface>
  category: FormControl<DeviceCategoryEnum | null>
  type: FormControl<DeviceTypeEnum | null>
  commands: FormArray<FormGroup<KeyValueFormInterface>>
}
