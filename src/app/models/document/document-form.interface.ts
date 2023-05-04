import {FormControl} from '@angular/forms';

export interface DocumentFormInterface {
  id: FormControl<string | null | undefined>,
  name: FormControl<string | null>,
}
