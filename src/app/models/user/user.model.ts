/*
export class UserModel {
  protected _email: string;

  constructor(user: DataUserInterface) {
    this._jeedom = user.jeedom ?? "";
    this._spotify = new OauthTokensModel(user.spotify ?? {});
    this._sonos = new OauthTokensModel(user.sonos ?? {});
    this._google = new OauthTokensModel(user.google ?? {});
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

  protected _google: OauthTokensModel;

  get google() {
    return this._google;
  }

  set google(oauthToken: OauthTokensModel) {
    this._google = oauthToken;
  }

  override toFirestore(): DataUserInterface {
    return {
      ...super.toFirestore(),
      email: this._email,
      jeedom: this._jeedom,
      spotify: this._spotify.toFirestore(),
      sonos: this._sonos.toFirestore(),
    };
  }
}*/
