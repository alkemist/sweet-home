import {InitializationMessage, WorkerMessage} from "../app/models/worker/worker-message.model.js";

export class WebWorker {
  _scope?: DedicatedWorkerGlobalScope;

  constructor(protected navigator: WorkerNavigator) {
  }

  onMessage(event: MessageEvent<WorkerMessage>) {
    const message = event.data;

    switch (message.type) {
      case "init":
        // console.log("-- [Web Worker] Initialization");
        postMessage(new InitializationMessage())
        break;

      default:
        console.log("-- [Web Worker] Unknown message received :", message);
        break;
    }
  }

  setScope(scope: unknown) {
    this._scope = scope as DedicatedWorkerGlobalScope;
  }
}
