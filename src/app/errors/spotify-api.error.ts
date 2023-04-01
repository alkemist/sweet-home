import { SpotifyError } from './spotify.error';
import { HttpErrorResponse } from '@angular/common/http';

export class SpotifyApiError extends SpotifyError {
  constructor(url: string, params: any, error: HttpErrorResponse) {
    super(`Api "${ url }"`, error, params);
  }
}
