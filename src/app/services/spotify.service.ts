import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, first, throwError } from 'rxjs';
import { DateHelper } from '@tools';
import { LoggerService } from './logger.service';
import { SpotifyApiError, SpotifyAuthError } from '@errors';
import { SpotifyAccessToken } from '@models';
import { UserService } from './user.service';
import { DOCUMENT } from '@angular/common';
import { MessageService } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  apiUrl: string = `https://api.spotify.com/v1/`;
  tokenUrl: string = `https://accounts.spotify.com/api/token`;
  authorizeUrl: string = `https://accounts.spotify.com/authorize`;
  accessToken: string = '';
  refreshToken: string = '';
  tokenType: string = '';
  expireSeconds: number = 0;
  lastAuth: number = 0;

  constructor(
    private http: HttpClient,
    protected loggerService: LoggerService,
    protected userService: UserService,
    protected messageService: MessageService,
    @Inject(DOCUMENT) private document: Document
  ) {

  }

  async playPlaylist() {
    (await this.buildQuery(`me/player/pause`)).subscribe((result) => console.log(result))
  }

  /*async getPlaylists(): Promise<SpotifyResponseInterface<SpotifyPlaylistInterface>> {
    return new Promise<SpotifyResponseInterface<SpotifyPlaylistInterface>>(async (resolve) => {
      (await this.buildQuery(`users/${ process.env['SPOTIFY_USER_ID'] }/playlists`))
        .subscribe((result) => resolve(result))
    });
  }*/

  updateAutorization() {
    this.messageService.add({
      severity: 'error',
      detail: $localize`We need authorization, we redirect to spotify in 2 seconds`
    });

    setTimeout(() => {
      this.document.location.href = `${ this.authorizeUrl }?`
        + `client_id=${ process.env['SPOTIFY_CLIENT_ID'] }`
        + `&response_type=code`
        + `&scope=user-modify-playback-state%20playlist-read-private`
        + `&redirect_uri=${ this.document.location.origin }/authorize`
        + `&state=${ new Date().getTime() }`;
    }, 2000)
  }

  private async buildQuery(url: string, params?: Record<string, any>) {
    let accessToken = await this.requestAccessToken('authorization_code');
    if (!accessToken) {
      accessToken = await this.requestAccessToken('refresh_token');
    }

    const headers = new HttpHeaders({
      'Authorization': `${ this.tokenType } ${ accessToken }`
    });

    // @TODO certaine requète sont en GET (liste playlist), d'autres en PUT (mettre sur pause)
    // https://engineering.atspotify.com/2022/04/spotifys-player-api/
    // return this.http.get(`${ this.apiUrl }${ url }`, { headers })
    return this.http.put(`${ this.apiUrl }${ url }`, {}, { headers })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.error) {
            switch (err.error.error.reason) {
              case "NO_ACTIVE_DEVICE":

                break;
            }
          }

          const error = new SpotifyApiError(url, params, err);
          this.loggerService.error(error)
          return throwError(() => error);
        }),
        first()
      );
  }

  private requestAccessToken(type: 'authorization_code' | 'refresh_token' | 'client_credentials') {
    return new Promise<string>((resolve) => {
      const needToken = !this.accessToken || !this.refreshToken
        || ((this.lastAuth + this.expireSeconds) < DateHelper.seconds())

      if (!needToken) {
        console.log('-- Spotify token valid');

        resolve(this.accessToken);
      }

      console.log(`-- Spotify request token "${ type }"`);

      const requestToken = Buffer.from(
        process.env['SPOTIFY_CLIENT_ID'] + ':' +
        process.env['SPOTIFY_CLIENT_SECRET']
      ).toString('base64');

      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${ requestToken }`
      });

      let body = `grant_type=${ type }`;

      if (type === 'authorization_code') {
        body += `&code=${ this.userService.getUserCode() }`
          + `&redirect_uri=${ this.document.location.origin }/authorize`;
      } else if (type === 'refresh_token') {
        body += `&refresh_token=${ this.refreshToken }`
      }

      return this.http.post(this.tokenUrl, body, { headers })
        .pipe(
          catchError((err: HttpErrorResponse) => {
            if (err.error) {
              switch (err.error.error) {
                case "invalid_grant":
                  if (type === 'authorization_code') {
                    this.updateAutorization();
                    return throwError(() => err);
                  }
              }
            }

            const error = new SpotifyAuthError(err);
            this.loggerService.error(error)
            return throwError(() => error);
          }),
          first()
        )
        .subscribe((result: any) => {
          const response = result as SpotifyAccessToken;

          console.log(`-- Spotify request token "${ type }" response`, response);
          this.lastAuth = DateHelper.seconds();

          this.accessToken = response.access_token;
          this.tokenType = response.token_type;
          this.expireSeconds = response.expires_in;

          // @TODO Appeler le refresh token que si nécessaire
          if (type === 'authorization_code') {
            this.refreshToken = response.refresh_token;
          } else if (type === 'refresh_token') {

            resolve(this.accessToken);
          }

          resolve('');
        })
    })


  }
}
