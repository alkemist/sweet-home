import { BaseError } from './base.error';
import { AppKey } from '@services';
import { HttpErrorResponse } from '@angular/common/http';

export class ApiError extends BaseError {
  constructor(apiKey: AppKey, httpError: HttpErrorResponse) {
    super();
    this.type = `Api ${ apiKey }`;

    if (typeof httpError.error === 'string') {
      this.message = `${ httpError.statusText } : ${ httpError.error }`;
    } else if (httpError.error && httpError.error.errorCode) {
      this.message = `${ httpError.error.errorCode }`;
      if (httpError.error.reason) {
        this.message += `: ${ httpError.error.reason }`;
      }
    } else {
      this.message = httpError.message;
    }

    console.error(httpError);
  }
}
