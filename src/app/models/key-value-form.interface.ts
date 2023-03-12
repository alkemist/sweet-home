import { FormControl } from '@angular/forms';

export interface KeyValueFormInterface {
  key: FormControl<string>
  value: FormControl<number>
}
