import {Title} from "@angular/platform-browser";
import {Injectable} from "@angular/core";
import {AppWorker} from "../models/worker/app-worker.model";
import {GeolocationWorker} from "@models";
import {environment} from "../../environments/environment";
import "../global"

@Injectable({
  providedIn: "root"
})
export class AppService {
  private pageTitle: string | undefined = undefined;
  private appWorker?: AppWorker;
  private geofence?: GeolocationWorker;

  constructor(private readonly titleService: Title) {
    if (typeof window.cordova === "undefined") {
      this.appWorker = new AppWorker("app");
    } else {
      this.geofence = new GeolocationWorker();
    }
  }

  setTitle(title: string | undefined) {
    if (this.pageTitle !== title) {
      this.pageTitle = title;

      if (title !== undefined) {
        this.titleService.setTitle(`${environment["APP_NAME"]} - ${title}`);
      } else {
        this.titleService.setTitle(`${environment["APP_NAME"]}`);
      }
    }
  }

  setSubTitle(subTitle?: string) {
    if (subTitle !== undefined) {
      this.titleService.setTitle(`${environment["APP_NAME"]} - ${this.pageTitle} - ${subTitle}`);
    } else {
      this.titleService.setTitle(`${environment["APP_NAME"]} - ${this.pageTitle}`);
    }
  }
}
