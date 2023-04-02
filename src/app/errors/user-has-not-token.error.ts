import { UserError } from './user.error';

export class UserHasNotTokenError extends UserError {
  constructor(type: string) {
    super();
    this.message = `User has no code "${ type }"`;
  }
}
