import {FormControl} from '@angular/forms';

export interface UserFormInterface {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}
