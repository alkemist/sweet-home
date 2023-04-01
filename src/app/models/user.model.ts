import { UserInterface, UserStoredInterface } from './user.interface';
import { DocumentModel } from './document.model';


export class UserModel extends DocumentModel {
  protected _email: string;
  protected _token: string;

  constructor(user: UserStoredInterface) {
    super(user);
    this._email = user.email ?? '';
    this._token = user.token ?? '';
    this._code = user.code ?? '';
  }

  protected _code: string;

  set code(code: string) {
    this._code = code;
  }

  override toFirestore(): UserInterface {
    return {
      ...super.toFirestore(),
      email: this._email,
      token: this._token,
      code: this._code,
    }
  }
}
