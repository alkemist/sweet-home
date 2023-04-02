import { BaseError } from './base.error';
import { AppKey } from '@services';
import { HttpErrorResponse } from '@angular/common/http';

export class ApiError extends BaseError {
  constructor(apiKey: AppKey, httpError: HttpErrorResponse) {
    super();
    this.type = `Api ${ apiKey }`;

    if (httpError.error && httpError.error.errorCode && httpError.error.reason) {
      // "ERROR_UNSUPPORTED_COMMAND" => "Command not found"
      this.message = `${ httpError.error.errorCode } : ${ httpError.error.reason }`;
    } else {
      this.message = httpError.message;
    }

    console.error(httpError);
  }
}
