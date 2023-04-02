import { ApiAppKey, UserService } from './user.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from './logger.service';
import { MessageService } from 'primeng/api';
import { ApiHelper, DateHelper } from '@tools';
import { catchError, first, throwError } from 'rxjs';
import { ApiAccessToken } from '@models';
import { ApiError } from '@errors';

export abstract class ApiService {
  protected abstract authorizeUrl: string;
  protected abstract tokenUrl: string;
  protected abstract apiUrl: string;

  protected abstract scope: string;

  protected abstract clientId: string;
  protected abstract clientSecret: string;

  protected accessToken: string = '';
  protected refreshToken: string = '';
  protected tokenType: string = '';
  protected expireSeconds: number = 0;
  protected lastAuth: number = 0;

  protected constructor(
    protected appKey: ApiAppKey,
    protected http: HttpClient,
    protected loggerService: LoggerService,
    protected userService: UserService,
    protected messageService: MessageService,
    protected document: Document
  ) {

  }

  updateAutorization() {
    this.messageService.add({
      severity: 'warning',
      detail: $localize`We need authorization`
    });

    setTimeout(() => {
      this.document.location.href = `${ this.authorizeUrl }?`
        + `client_id=${ this.clientId }`
        + `&response_type=code`
        + `&scope=${ this.scope }`
        + `&redirect_uri=${ this.document.location.origin }/authorize/${ this.appKey }`
        + `&state=${ new Date().getTime() }`;
    }, 5000)
  }

  async buildGetQuery(url: string) {
    const accessToken = await this.getAccessToken();

    return new Promise<unknown>(async (resolve) => {
      (await this.http.get(`${ this.apiUrl }${ url }`, {
        headers: ApiHelper.buildHeaders(this.tokenType, accessToken)
      }))
        .pipe(
          first(),
          catchError((err) => this.handleError(err)),
        )
        .subscribe((result) => resolve(result))
    });
  }

  async getAccessToken(): Promise<string> {
    const needToken = !this.accessToken || !this.refreshToken
      || ((this.lastAuth + this.expireSeconds) < DateHelper.seconds())

    if (needToken) {
      return await this.requestToken(this.refreshToken ? 'refresh_token' : 'authorization_code');
    }

    return Promise.resolve(this.accessToken);
  }

  protected requestToken(tokenType: 'authorization_code' | 'refresh_token') {
    return new Promise<string>((resolve) => {

      console.log(`-- [${ this.appKey }] request token "${ tokenType }"`);

      let body = `grant_type=${ tokenType }`;

      if (tokenType === 'authorization_code') {
        const code = this.userService.getToken(this.appKey);
        if (!code) {
          this.updateAutorization();
        }

        body += `&code=${ code }`
          + `&redirect_uri=${ this.document.location.origin }/authorize/${ this.appKey }`;
      } else if (tokenType === 'refresh_token') {
        body += `&refresh_token=${ this.refreshToken }`
      }

      const requestToken = Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64');
      this.lastAuth = DateHelper.seconds();

      return this.http.post(this.tokenUrl, body, {
        headers: ApiHelper.buildHeaders(
          'Basic',
          requestToken,
          'application/x-www-form-urlencoded',
          this.appKey === 'sonos'
        )
      })
        .pipe(
          first(),
          catchError((err) => this.handleError(err)),
        )
        .subscribe((result: any) => {
          const response = result as ApiAccessToken;

          console.log(`-- [${ this.appKey }] request token "${ tokenType }" response`, response);

          this.accessToken = response.access_token;
          this.tokenType = response.token_type;
          this.expireSeconds = response.expires_in;

          if (tokenType === 'authorization_code') {
            this.refreshToken = response.refresh_token;
          }

          resolve(this.accessToken);
        })
    })
  }

  private handleError(httpError: HttpErrorResponse) {
    if (httpError.error && httpError.error.error === 'invalid_grant') {
      this.updateAutorization();
      return throwError(() => httpError);
    }

    const error = new ApiError(this.appKey, httpError);
    this.loggerService.error(error)
    return throwError(() => error);
  }
}
