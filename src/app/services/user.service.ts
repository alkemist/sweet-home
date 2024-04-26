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

  override logout() {
    super.logout();
    return this.router.navigate([ '/login' ])
  }

  async getJeedomApiKey() {
    const loggedUser = await this.getLoggedUser();

    return loggedUser ? loggedUser.data.jeedom : '';
  }
}
