import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from './logger.service';
import { UserService } from './user.service';
import { MessageService } from 'primeng/api';
import { DOCUMENT } from '@angular/common';
import { OauthApiService } from './oauth-api.service';
import { SonosSessionInterface } from '@models';

@Injectable({
  providedIn: 'root'
})
export class SonosService extends OauthApiService {
  authorizeUrl: string = `https://api.sonos.com/login/v3/oauth`;
  tokenUrl: string = "/sonos-auth";
  apiUrl: string = "/sonos-api/";

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

  async test() {
    const households = await this.buildGetQuery('households')
    console.log('-- [sonos] households', households)
    const householdId = "Sonos_5ngsjv5sG9tMJjlrqqLvdfnpA2.1SuK5if1VAH9eUO4l16S"

    const groups = await this.buildGetQuery(`households/${ householdId }/groups`)
    console.log('-- [sonos] groups', groups)
    const groupId = "RINCON_48A6B83EC16601400:3121885620";

    const playlists = await this.buildGetQuery(`households/${ householdId }/playlists`);
    console.log('-- [sonos] playlists', playlists)

    const session = await this.buildPostQuery(`groups/${ groupId }/playbackSession/joinOrCreate`, {
      appId: "sweet.home",
      appContext: "test",
      customData: "playlistid:12345"
    }) as SonosSessionInterface;
    console.log('-- [sonos] session join or create', session);

    if (session) {
      const loadCloudQueue = await this.buildPostQuery(`playbackSessions/${ session.sessionId }/playbackSession/loadCloudQueue`, {
        queueBaseUrl: "https://spotify-v5.ws.sonos.com/smapi"
      })
      console.log('-- [sonos] load cloud queue', loadCloudQueue);
    }


    // https://github.com/SoCo/SoCo/blob/v0.29.1/soco/plugins/sharelink.py
    // avTransport => AddURIToQueue

    // https://github.com/robbi5/add-to-sonos-queue/blob/master/src/lib/sonos.js#L13
    // /MediaRenderer/AVTransport/Control AddURIToQueue

    // https://github.com/jishi/node-sonos-http-api/blob/master/lib/actions/spotify.js
    // addURIToQueue

    // https://github.com/DjMomo/sonos/blob/master/sonos.class.php
    // AddURIToQueue

    // https://github.com/svrooij/node-sonos-ts/blob/master/src/sonos-device.ts

    // https://svrooij.io/sonos-api-docs/music-services.html
    // https://svrooij.io/sonos-api-docs/services/av-transport.html#adduritoqueue
    // id:9	Name:Spotify	Auth:AppLink	Url:https://spotify-v5.ws.sonos.com/smapi
    // IP : 192.168.0.61
  }
}
