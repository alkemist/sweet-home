import {DateHelper} from "@tools";

export interface OauthTokenInterface {
  token: string
  expires_in: number
  token_type: 'Basic' | 'Bearer'
  date?: number
}

export class OauthTokenModel {
  private _token: string
  private _expiresIn: number
  private _tokenType: 'Basic' | 'Bearer'
  private _date: number

  constructor(json: OauthTokenInterface) {
    this._token = json.token;
    this._expiresIn = json.expires_in;
    this._tokenType = json.token_type ?? 'Basic';
    this._date = json.date ?? DateHelper.seconds();
  }

  toHeaders(contentType?: string) {
    const headers: Record<string, string> = {
      'Authorization': `${ this._tokenType } ${ this._token }`
    }

    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    return new HttpHeaders(headers);
  }

  isValid(): boolean {
    return  ((this._date + this._expiresIn) < DateHelper.seconds())
  }

  toFirestore(): OauthTokenInterface {
    return {
      token: this._token,
      expires_in: this._expiresIn,
      token_type: this._tokenType,
      date: this._date,
    }
  }
}
