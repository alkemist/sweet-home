import { InitializationMessage, WorkerMessage } from "./worker-message.model";
import { UnknownWorkerError } from "@errors";
import { GeolocationWorker } from "./geolocation-worker.model";
import { combineLatest } from "rxjs";
import { NotificationWorker } from "./notification-worker.model";
import {environment} from "../../../environments/environment";
import {createDistantWebWorker, createLocalWebWorker} from "./create-web-worker";

export type WorkerName = 'app';

export class AppWorker {
  private webWorker?: Worker;
  private geolocationWorker = new GeolocationWorker();
  private notificationWorker = new NotificationWorker();

  constructor(baseUrl: string, workerName: WorkerName) {
    switch (workerName) {
      case "app":
        /*if (environment["APP_LOCAL"]) {
          this.init(createLocalWebWorker())
        } else {*/
          createDistantWebWorker(baseUrl).then((worker) => this.init(worker))
        //}
        break;

      default:
        throw new UnknownWorkerError(workerName);
    }
  }

  init(webWorker: Worker) {
    this.webWorker = webWorker;
    this.webWorker.onmessage = this.onMessage;

    combineLatest([
      this.geolocationWorker.ready$,
      this.notificationWorker.ready$,
    ]).subscribe(([geolocationGranted, notificationGranted]) => {
      // console.log('-- [App Worker] Permissions', geolocationGranted, notificationGranted);

      if (geolocationGranted && notificationGranted) {
        this.post(new InitializationMessage())
      }
    });

    this.geolocationWorker.checkPermission();
    this.notificationWorker.checkPermission();
  }

  post(message: WorkerMessage) {
    this.webWorker?.postMessage(message);
  }

  onMessage(event: MessageEvent<WorkerMessage>) {
    const message = event.data;
    switch (message.type) {
      case "init":
        console.log("-- [App Worker] Initialized");
        break;

      default:
        console.log("-- [App Worker] Unknown message received :", message);
        break;
    }
  }
}

