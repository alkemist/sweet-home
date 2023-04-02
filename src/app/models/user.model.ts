import { UserInterface, UserStoredInterface } from './user.interface';
import { DocumentModel } from './document.model';


export class UserModel extends DocumentModel {
  protected _email: string;

  constructor(user: UserStoredInterface) {
    super(user);
    this._email = user.email ?? '';
    this._jeedom = user.jeedom ?? '';
    this._spotify = user.spotify ?? '';
    this._sonos = user.sonos ?? '';
  }

  protected _jeedom: string;

  get jeedom(): string {
    return this._jeedom;
  }

  protected _sonos: string;

  get sonos() {
    return this._sonos;
  }

  set sonos(code: string) {
    this._sonos = code;
  }

  protected _spotify: string;

  get spotify() {
    return this._spotify;
  }

  set spotify(code: string) {
    this._spotify = code;
  }

  override toFirestore(): UserInterface {
    return {
      ...super.toFirestore(),
      email: this._email,
      jeedom: this._jeedom,
      spotify: this._spotify,
      sonos: this._sonos,
    }
  }
}
