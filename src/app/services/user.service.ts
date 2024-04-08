import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { DataStoreUserService } from '@alkemist/ngx-data-store';
import { DataUserInterface } from '@models';

export type AppKey = "sonos" | "spotify";

@Injectable({
  providedIn: "root"
})
export class UserService extends DataStoreUserService<DataUserInterface> {
  constructor(
    protected router: Router,
  ) {
    super();
  }

  logout() {
    return Promise.resolve();
  }

  async getJeedomApiKey() {
    return (await this.getLoggedUser()).data.jeedom;
  }
}
