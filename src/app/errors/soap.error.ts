import { BaseError } from './base.error';
import { HttpErrorResponse } from '@angular/common/http';

export class SoapError extends BaseError {
  override type = 'Soap';

  constructor(httpError: HttpErrorResponse) {
    super();

    this.context = httpError;
  }
}
