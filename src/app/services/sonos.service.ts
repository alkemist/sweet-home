import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from './logger.service';
import { UserService } from './user.service';
import { MessageService } from 'primeng/api';
import { DOCUMENT } from '@angular/common';
import { OauthApiService } from './oauth-api.service';


@Injectable({
  providedIn: 'root'
})
export class SonosService extends OauthApiService {
  authorizeUrl: string = `https://api.sonos.com/login/v3/oauth`;
  tokenUrl: string = process.env['APP_PROXY'] ? "/sonos-auth" : `https://api.sonos.com/login/v3/oauth/access`;
  apiUrl: string = process.env['APP_PROXY'] ? "/sonos-api/" : `https://api.ws.sonos.com/control/api/v1/`;

  scope: string = 'playback-control-all';

  clientId = process.env['SONOS_KEY'] as string;
  clientSecret = process.env['SONOS_SECRET'] as string;

  constructor(
    http: HttpClient,
    loggerService: LoggerService,
    userService: UserService,
    messageService: MessageService,
    @Inject(DOCUMENT) document: Document
  ) {
    super('sonos', http, loggerService, userService, messageService, document);
  }
}
