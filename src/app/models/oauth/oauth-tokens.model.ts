import {OauthTokenInterface, OauthTokenModel} from "./oauth-token.model";

export interface OauthTokensInterface {
  refreshToken?: OauthTokenInterface | null,
  accessToken?: OauthTokenInterface | null,
}

export class OauthTokensModel {
  private _refreshToken?: OauthTokenModel;
  private _accessToken?: OauthTokenModel;

  constructor(json: OauthTokensInterface) {
    if (json.refreshToken) {
      this._refreshToken = new OauthTokenModel(json.refreshToken)
    }

    if (json.accessToken) {
      this._accessToken = new OauthTokenModel(json.accessToken);
    }
  }

  setRefreshToken(token: OauthTokenModel) {
    this._refreshToken = token;
  }

  setAccessToken(token: OauthTokenModel) {
    this._accessToken = token;
  }

  getRefreshToken(): OauthTokenModel | undefined {
    if (this._refreshToken && !this._refreshToken.isValid()) {
      return undefined;
    }
    return this._refreshToken;
  }

  getAccessToken(): OauthTokenModel | undefined {
    if (this._accessToken && !this._accessToken.isValid()) {
      return undefined;
    }
    return this._accessToken;
  }

  toFirestore(): OauthTokensInterface {
    return {
      refreshToken: this._refreshToken?.toFirestore() ?? null,
      accessToken: this._accessToken?.toFirestore() ?? null,
    }
  }
}
