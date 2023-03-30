import {WorkerError} from "./worker.error";

export class UnknownWorkerError extends WorkerError {
  constructor(public override context?: any) {
    super();
  }
}
