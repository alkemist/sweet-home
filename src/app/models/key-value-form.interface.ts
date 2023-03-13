import { FormControl } from '@angular/forms';

export interface KeyValueFormInterface {
  key: FormControl<string | null>
  value: FormControl<number | null>
}
