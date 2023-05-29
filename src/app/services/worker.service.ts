import {Title} from "@angular/platform-browser";
import {Inject, Injectable} from "@angular/core";
import {AppWorker} from "../models/worker/app-worker.model";
import {GeolocationWorker} from "@models";
import "../global"
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class WorkerService {
  private appWorker?: AppWorker;
  private geofence?: GeolocationWorker;

  constructor() {
    if (typeof window.cordova === "undefined") {
      this.appWorker = new AppWorker("app");
    } else {
      this.geofence = new GeolocationWorker();
    }
  }
}
