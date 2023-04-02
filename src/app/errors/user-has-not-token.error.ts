import { UserError } from './user.error';

export class UserHasNotTokenError extends UserError {
  constructor() {
    super();
    this.message = `User has no jeedom token`;
  }
}
