import { UserInterface } from '@app/models/user.interface';
import { DataObjectModel } from '@app/models/data-object.model';

export class UserModel extends DataObjectModel {
  protected _email: string;
  protected _token: string;

  constructor(user: UserInterface) {
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
