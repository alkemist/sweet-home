export type WorkerMessageType = 'init';

export class WorkerMessage {
  constructor(public type: WorkerMessageType, public data?: any) {
  }
}

export class InitializationMessage extends WorkerMessage {
  constructor() {
    super('init');
  }
}
