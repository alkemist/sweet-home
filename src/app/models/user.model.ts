import { UserInterface, UserStoredInterface } from '@app/models/user.interface';
import { DocumentModel } from '@app/models/document.model';

export class UserModel extends DocumentModel {
  protected _email: string;
  protected _token: string;

  constructor(user: UserStoredInterface) {
    super(user);
    this._email = user.email;
    this._token = user.token;
  }

  override toFirestore(): UserInterface {
    return {
      ...super.toFirestore(),
      email: this._email,
      token: this._token,
    }
  }
}
