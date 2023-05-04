import {DateHelper} from "@tools";
import {HttpHeaders} from '@angular/common/http';

export interface OauthTokenInterface {
  token: string
  expires_in?: number
  token_type: 'Basic' | 'Bearer'
  date?: number
}

export class OauthTokenModel {
  private _expiresIn: number
  private _tokenType: 'Basic' | 'Bearer'
  private _date: number

  constructor(json: OauthTokenInterface) {
    this._token = json.token;
    this._expiresIn = json.expires_in ?? 0;
    this._tokenType = json.token_type;
    this._date = json.date ?? DateHelper.seconds();
  }

  private _token: string

  get token() {
    return this._token;
  }

  toHeaders(contentType?: string) {
    const headers: Record<string, string> = {
      'Authorization': `${this._tokenType} ${this._token}`,
      //'Access-Control-Allow-Origin': 'https://my-sweet-home.netlify.app/',
      //'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, cache-control, pragma, expires',
      //'Access-Control-Allow-Credentials': 'true'
    }

    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    return new HttpHeaders(headers);
  }

  isValid(): boolean {
    return !this._expiresIn || ((this._date + this._expiresIn) > DateHelper.seconds())
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
