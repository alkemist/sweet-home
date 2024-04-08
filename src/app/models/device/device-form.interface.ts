import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { KeyValueFormInterface } from '../key-value-form.interface';
import { DeviceCategoryEnum, DeviceConnectivityEnum, DeviceTypeEnum } from './device.enum';

export interface DeviceFormInterface {
  id: FormControl<string | null>
  name: FormControl<string | null>
  connectivity: FormControl<DeviceConnectivityEnum | null>
  category: FormControl<DeviceCategoryEnum | null>
  type: FormControl<DeviceTypeEnum | null>
  jeedomId?: FormControl<number | null>
  positionX?: FormControl<number | null>
  positionY?: FormControl<number | null>
  infoCommandIds: FormArray<FormGroup<KeyValueFormInterface<number>>>
  actionCommandIds: FormArray<FormGroup<KeyValueFormInterface<number>>>
  configurationValues: FormArray<FormGroup<KeyValueFormInterface<string>>>
  parameterValues: FormArray<FormGroup<KeyValueFormInterface<string>>>
}
