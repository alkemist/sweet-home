export class BaseError extends Error {
  type: string = 'Unknown';
  logged: boolean = true;
  context?: any;
}
