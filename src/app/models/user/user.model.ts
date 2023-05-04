import {UserInterface, UserStoredInterface} from './user.interface';
import {DocumentModel} from '../document';
import {OauthTokensModel} from "../oauth";


export class UserModel extends DocumentModel {
  protected _email: string;

  constructor(user: UserStoredInterface) {
    super(user);
    this._email = user.email ?? '';
    this._jeedom = user.jeedom ?? '';
    this._spotify = new OauthTokensModel(user.spotify ?? {});
    this._sonos = new OauthTokensModel(user.sonos ?? {});
  }

  protected _jeedom: string;

  get jeedom(): string {
    return this._jeedom;
  }

  protected _sonos: OauthTokensModel;

  get sonos() {
    return this._sonos;
  }

  set sonos(oauthToken: OauthTokensModel) {
    this._sonos = oauthToken;
  }

  protected _spotify: OauthTokensModel;

  get spotify() {
    return this._spotify;
  }

  set spotify(oauthToken: OauthTokensModel) {
    this._spotify = oauthToken;
  }

  override toFirestore(): UserInterface {
    return {
      ...super.toFirestore(),
      email: this._email,
      jeedom: this._jeedom,
      spotify: this._spotify.toFirestore(),
      sonos: this._sonos.toFirestore(),
    }
  }
}
