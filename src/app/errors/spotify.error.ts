import { BaseError } from './base.error';
import { HttpErrorResponse } from '@angular/common/http';

export class SpotifyError extends BaseError {
  override type = 'Spotify';

  constructor(override message: string, error: HttpErrorResponse, params?: any) {
    super();

    this.context = {
      error,
      params
    }

    this.message += ' : ';
    if (error.error && error.error.error && error.error.error.reason) {
      this.message += `${ error.error.error.reason } ${ error.error.error.message }`;
    } else if (error.error && error.error.error && error.error.error.status && error.error.error.message) {
      this.message += `${ error.error.error.status } ${ error.error.error.message }`;
    } else if (error.error && error.error.error_description) {
      this.message += `${ error.error.error } ${ error.error.error_description }`;
    } else {
      this.message += error.message;
    }
  }
}
