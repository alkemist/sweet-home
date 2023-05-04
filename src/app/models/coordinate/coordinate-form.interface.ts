import {FormControl} from '@angular/forms';

export interface CoordinateFormInterface {
  x: FormControl<number | null>,
  y: FormControl<number | null>,
}
