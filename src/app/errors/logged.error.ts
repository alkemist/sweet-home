export class LoggedError<T> extends Error {
  type: string = 'Unknown';
  context?: T;

  constructor() {
    super();
  }
}