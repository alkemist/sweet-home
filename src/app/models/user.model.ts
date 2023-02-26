import { UserInterface } from '@app/models/user.interface';

export class UserModel {
  protected _id: string;
  protected _name: string;
  protected _slug: string;
  protected _email: string;
  protected _token: string;

  constructor(user: UserInterface) {
    this._id = user.id ?? '';
    this._name = user.name ?? '';
    this._slug = user.slug ?? '';
    this._email = user.email;
    this._token = user.token;
  }

  toFirestore(): UserInterface {
    return {
      name: this._name,
      email: this._email,
      token: this._token,
    }
  }
}
