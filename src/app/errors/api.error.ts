import { BaseError } from './base.error';
import { ApiAppKey } from '@services';
import { HttpErrorResponse } from '@angular/common/http';

export class ApiError extends BaseError {
  constructor(apiKey: ApiAppKey, httpError: HttpErrorResponse) {
    super();
    this.type = `Api ${ apiKey }`;

    // status: 0, statusText: "Unknown Error", error is ProgressEvent,
    //            message: "Http failure response for https://api.sonos.com/login/v3/oauth/access: 0 Unknown Error"
    this.message = httpError.message;

    console.log(httpError);
  }
}
