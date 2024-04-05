import { Injectable } from "@angular/core";
import { LoggerService } from "./logger.service";
import { MessageService } from "primeng/api";
import { JsonService } from "./json.service";
import { Router } from "@angular/router";
import { DataStoreUserService } from '@alkemist/ngx-data-store';

export type AppKey = "sonos" | "spotify";

@Injectable({
  providedIn: "root"
})
export class UserService extends DataStoreUserService {

  constructor(
    messageService: MessageService,
    loggerService: LoggerService,
    jsonService: JsonService,
    protected router: Router,
  ) {
    super();
  }

  logout() {
    return Promise.resolve();
  }

  /*getJeedomApiKey(): string {
    return this.user.jeedom;
  }

  getToken(appKey: AppKey): OauthTokensModel {
    return this.user[appKey];
  }

  updateRefreshToken(type: AppKey, oauthToken: OauthTokenModel) {
    if (this._user) {
      this._user[type].setRefreshToken(oauthToken);
      return this.updateOne(this._user);
    }
    return Promise.reject();
  }

  updateAccessToken(type: AppKey, oauthToken: OauthTokenModel) {
    if (this._user) {
      this._user[type].setAccessToken(oauthToken);
      return this.updateOne(this._user);
    }
    return Promise.reject();
  }*/
}
