import { UserError } from './user.error';

export class UnknownTokenError extends UserError {
  constructor(type: string) {
    super();
    this.message = `No token "${ type }"`;
  }
}
