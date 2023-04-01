import { SpotifyError } from './spotify.error';
import { HttpErrorResponse } from '@angular/common/http';

export class SpotifyAuthError extends SpotifyError {

  constructor(error: HttpErrorResponse) {
    super('Auth', error);
  }
}
