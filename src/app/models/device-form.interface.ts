import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CoordinateFormInterface } from '@app/models/coordinate-form.interface';
import { KeyValueFormInterface } from '@app/models/key-value-form.interface';
import { DeviceTypeEnum } from '@app/models/device-type.enum';
import { DeviceCategoryEnum } from '@app/models/device-category.enum';
import { DocumentFormInterface } from '@app/models/document-form.interface';

export interface DeviceFormInterface extends DocumentFormInterface {
  position: FormGroup<CoordinateFormInterface>
  category: FormControl<DeviceCategoryEnum | null>
  type: FormControl<DeviceTypeEnum | null>
  commands: FormArray<FormGroup<KeyValueFormInterface>>
}
