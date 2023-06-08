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

  constructor(
    @Inject(DOCUMENT) document: Document
  ) {
    if (typeof window.cordova === "undefined") {
      this.appWorker = new AppWorker(document.location.origin, "app");
    } else {
      this.geofence = new GeolocationWorker();
    }
  }
}
