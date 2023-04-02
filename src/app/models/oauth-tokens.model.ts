import {OauthTokenInterface, OauthTokenModel} from "./oauth-token.model";

export interface OauthTokensInterface {
  authorizationCode?: string,
  refreshToken?: OauthTokenInterface,
  accessToken?: OauthTokenInterface,
}

export class OauthTokensModel {
  private _authorizationCode?: string;
  private _refreshToken?: OauthTokenModel;
  private _accessToken?: OauthTokenModel;

  constructor(json: OauthTokensInterface) {
    this._authorizationCode = json.authorizationCode;

    if (json.refreshToken) {
      this._refreshToken = new OauthTokenModel(json.refreshToken)
    }

    if (json.accessToken) {
      this._accessToken = new OauthTokenModel(json.accessToken);
    }
  }

  get authorizationCode() {
    return this._authorizationCode;
  }

  set authorizationCode(authorizationCode: string) {
    this._authorizationCode = authorizationCode;
  }

  get refreshToken() {
    return this._refreshToken;
  }

  set refreshToken(token: OauthTokenInterface) {
    this._refreshToken = new OauthTokenModel(token);
  }

  get accessToken() {
    return this._accessToken;
  }

  set accessToken(token: OauthTokenInterface) {
    this._accessToken = new OauthTokenModel(token);
  }

  toFirestore(): OauthTokensInterface {
    return {
      authorizationCode: this._authorizationCode,
      refreshToken: this._refreshToken?.toFirestore(),
      accessToken: this._accessToken?.toFirestore(),
    }
  }
}
