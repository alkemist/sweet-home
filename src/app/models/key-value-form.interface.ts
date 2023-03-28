import { FormControl } from '@angular/forms';

export interface KeyValueFormInterface<V> {
  key: FormControl<string | null>
  value: FormControl<V | null>
}
