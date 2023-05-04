import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {CoordinateFormInterface} from '../coordinate';
import {KeyValueFormInterface} from '../key-value-form.interface';
import {DeviceCategoryEnum, DeviceConnectivityEnum, DeviceTypeEnum} from './device.enum';
import {DocumentFormInterface} from '../document';

export interface DeviceFormInterface extends DocumentFormInterface {
  connectivity: FormControl<DeviceConnectivityEnum | null>
  category: FormControl<DeviceCategoryEnum | null>
  type: FormControl<DeviceTypeEnum | null>
  jeedomId?: FormControl<number | null>
  position: FormGroup<CoordinateFormInterface>
  infoCommandIds: FormArray<FormGroup<KeyValueFormInterface<number>>>
  actionCommandIds: FormArray<FormGroup<KeyValueFormInterface<number>>>
  configurationValues: FormArray<FormGroup<KeyValueFormInterface<string>>>
  parameterValues: FormArray<FormGroup<KeyValueFormInterface<string>>>
}
