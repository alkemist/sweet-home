import { InitializationMessage, WorkerMessage } from "./worker-message.model";
import { UnknownWorkerError } from "@errors";
import { GeolocationWorker } from "./geolocation-worker.model";
import { combineLatest } from "rxjs";
import { NotificationWorker } from "./notification-worker.model";

export type WorkerName = 'app';

export class AppWorker {
  private webWorker: Worker;
  private geolocationWorker = new GeolocationWorker();
  private notificationWorker = new NotificationWorker();

  constructor(workerName: WorkerName) {
    switch (workerName) {
      case "app":
        this.webWorker = new Worker(new URL(`../../workers/web.worker`, import.meta.url));
        this.webWorker.onmessage = this.onMessage;
        break;

      default:
        throw new UnknownWorkerError(workerName);
    }

    combineLatest([
      this.geolocationWorker.ready$,
      this.notificationWorker.ready$,
    ]).subscribe(([ geolocationGranted, notificationGranted ]) => {
      // console.log('-- [App Worker] Permissions', geolocationGranted, notificationGranted);

      if (geolocationGranted && notificationGranted) {
        this.post(new InitializationMessage())
      }
    });

    this.geolocationWorker.checkPermission();
    this.notificationWorker.checkPermission();
  }

  post(message: WorkerMessage) {
    this.webWorker.postMessage(message);
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

