/// <reference lib="webworker" />

import {WebWorker} from "./web-worker.model";

const webWorker = new WebWorker(navigator);

addEventListener('message', function (event) {
  webWorker.setScope(this);
  webWorker.onMessage(event)
});
