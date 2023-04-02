import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import { UserService } from './user.service';
import { DOCUMENT } from '@angular/common';
import { MessageService } from 'primeng/api';
import { OauthApiService } from './oauthApiService';


@Injectable({
  providedIn: 'root'
})
export class SpotifyService extends OauthApiService {
  authorizeUrl: string = `https://accounts.spotify.com/authorize`;
  tokenUrl: string = `https://accounts.spotify.com/api/token`;
  apiUrl: string = `https://api.spotify.com/v1/`;

  scope: string = "user-modify-playback-state%20playlist-read-private";

  clientId = process.env['SPOTIFY_CLIENT_ID'] as string;
  clientSecret = process.env['SPOTIFY_CLIENT_SECRET'] as string;

  constructor(
    http: HttpClient,
    loggerService: LoggerService,
    userService: UserService,
    messageService: MessageService,
    @Inject(DOCUMENT) document: Document
  ) {
    super('spotify', http, loggerService, userService, messageService, document);
  }


  /*async playPlaylist() {
    (await this.buildQuery(`me/player/pause`)).subscribe((result) => console.log(result))
  }

  async getPlaylists(): Promise<SpotifyResponseInterface<SpotifyPlaylistInterface>> {
    return new Promise<SpotifyResponseInterface<SpotifyPlaylistInterface>>(async (resolve) => {
      (await this.buildQuery(`users/${ process.env['SPOTIFY_USER_ID'] }/playlists`))
        .subscribe((result) => resolve(result))
    });
  }*/

  /*private async buildQuery(url: string, params?: Record<string, any>) {
    let accessToken = await this.requestToken('authorization_code');
    if (!accessToken) {
      accessToken = await this.requestToken('refresh_token');
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

          this.loggerService.error(error)
          return throwError(() => error);
        }),
        first()
      );
  }*/
}
