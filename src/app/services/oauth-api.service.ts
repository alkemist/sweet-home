import { AppKey, UserService } from './user.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from './logger.service';
import { MessageService } from 'primeng/api';
import { ApiAccessToken, OauthTokenModel } from '@models';
import { catchError, first, throwError } from 'rxjs';
import { ApiError } from '@errors';

export abstract class OauthApiService {
  protected abstract authorizeUrl: string;
  protected abstract tokenUrl: string;
  protected abstract apiUrl: string;

  protected abstract scope: string;

  protected abstract clientId: string;
  protected abstract clientSecret: string;

  protected constructor(
    protected appKey: AppKey,
    protected http: HttpClient,
    protected loggerService: LoggerService,
    protected userService: UserService,
    protected messageService: MessageService,
    protected document: Document
  ) {

  }

  updateAutorization() {
    this.messageService.add({
      severity: 'warn',
      life: 3600,
      detail: $localize`Redirect for authorization request`
    });

    const redirectUri = `${ this.document.location.origin }/authorize/${ this.appKey }`

    setTimeout(() => {
      this.document.location.href = `${ this.authorizeUrl }?`
        + `client_id=${ this.clientId }`
        + `&response_type=code`
        + `&scope=${ this.scope }`
        + `&redirect_uri=${ redirectUri }`
        + `&state=${ new Date().getTime() }`;
    }, 1000)
  }

  async buildGetQuery(url: string) {
    const accessToken = await this.getAccessToken();

    if (accessToken) {
      return new Promise<unknown>(async (resolve) => {
        (await this.http.get(`${ this.apiUrl }${ url }`, {
          headers: accessToken.toHeaders(),
        }))
          .pipe(
            first(),
            catchError((err) => this.handleError(err)),
          )
          .subscribe((result) => resolve(result))
      });
    }
    return Promise.resolve();
  }

  async buildPostQuery(url: string, params?: any) {
    const accessToken = await this.getAccessToken();

    if (accessToken) {
      return new Promise<unknown>(async (resolve) => {
        (await this.http.post(`${ this.apiUrl }${ url }`, params, {
          headers: accessToken.toHeaders('application/json'),
        }))
          .pipe(
            first(),
            catchError((err) => this.handleError(err)),
          )
          .subscribe((result) => resolve(result))
      });
    }
    return Promise.resolve();
  }

  async buildPutQuery(url: string, params?: any) {
    const accessToken = await this.getAccessToken();

    if (accessToken) {
      return new Promise<unknown>(async (resolve) => {
        (await this.http.put(`${ this.apiUrl }${ url }`, params, {
          headers: accessToken.toHeaders(),
        }))
          .pipe(
            first(),
            catchError((err) => this.handleError(err)),
          )
          .subscribe((result) => resolve(result))
      });
    }
    return Promise.resolve();
  }

  async getAccessToken(): Promise<OauthTokenModel | null> {
    const accessToken = this.userService.getToken(this.appKey).getAccessToken();
    const refreshToken = this.userService.getToken(this.appKey).getRefreshToken();

    //console.log(`-- [${ this.appKey }] current access token`, accessToken);

    if (!accessToken) {
      if (!refreshToken) {
        this.updateAutorization();
        return Promise.resolve(null);
      }
      return await this.requestToken('refresh_token');
    }

    return Promise.resolve(accessToken);
  }

  updateRefreshToken(authorizationCode: string): Promise<OauthTokenModel> {
    return this.requestToken('authorization_code', authorizationCode);
  }

  protected requestToken(tokenType: 'authorization_code' | 'refresh_token', authorizationCode?: string) {
    return new Promise<OauthTokenModel>((resolve) => {

      //console.log(`-- [${ this.appKey }] request token "${ tokenType }"`);

      let body = `grant_type=${ tokenType }`;

      if (tokenType === 'authorization_code') {
        //console.log(`-- [${ this.appKey }] authorization code "${ authorizationCode }"`);

        body += `&code=${ authorizationCode }`
          + `&redirect_uri=${ this.document.location.origin }/authorize/${ this.appKey }`;
      } else if (tokenType === 'refresh_token') {
        const refreshToken = this.userService.getToken(this.appKey).getRefreshToken();
        body += `&refresh_token=${ refreshToken?.token }`
      }

      const requestToken = Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64');

      return this.http.post(this.tokenUrl, body, {
        headers: new OauthTokenModel({ token: requestToken, token_type: 'Basic' })
          .toHeaders('application/x-www-form-urlencoded')
      })
        .pipe(
          first(),
          catchError((err) => this.handleError(err)),
        )
        .subscribe((result: any) => {
          const response = result as ApiAccessToken;

          //console.log(`-- [${ this.appKey }] request token "${ tokenType }" response`, response);

          const accessToken = new OauthTokenModel({
            token: response.access_token,
            expires_in: response.expires_in,
            token_type: response.token_type,
          })

          if (tokenType === 'authorization_code') {
            void this.userService.updateRefreshToken(this.appKey, new OauthTokenModel({
              token: response.refresh_token,
              token_type: response.token_type,
            }))
          }

          void this.userService.updateAccessToken(this.appKey, accessToken);

          resolve(accessToken);
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
