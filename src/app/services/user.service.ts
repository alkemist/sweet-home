import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, of } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { UserInterface, UserModel } from '@models';
import {
  InvalidEmailError,
  OfflineError,
  TooManyRequestError,
  UserNotExistError,
  WrongApiKeyError,
  WrongPasswordError
} from '@errors';
import { LoggerService } from './logger.service';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { MessageService } from 'primeng/api';
import {OauthTokenInterface, OauthTokenModel} from "../models/oauth-token.model";
import {OauthTokensModel} from "../models/oauth-tokens.model";

export type AppKey = 'sonos' | 'spotify';

@Injectable({
  providedIn: 'root'
})
export class UserService extends FirestoreService<UserInterface, UserModel> {
  private auth = getAuth();
  private _isLoggedIn: BehaviorSubject<boolean | null>;

  constructor(messageService: MessageService, loggerService: LoggerService) {
    super(messageService, loggerService, 'user', $localize`User`, UserModel);
    this._isLoggedIn = new BehaviorSubject<boolean | null>(null);

    onAuthStateChanged(this.auth, (userFirebase) => {
      if (!userFirebase) {
        this._isLoggedIn.next(false);
      } else {
        void this.getUser(userFirebase);
      }
    });
  }

  private _user: UserModel | null = null;

  get user() {
    return this._user as UserModel;
  }

  isLoggedIn(): Observable<boolean> {
    if (this._user) {
      return of(true);
    }

    return this._isLoggedIn.asObservable().pipe(
      filter((isLoggedIn) => isLoggedIn !== null),
      map((isLoggedIn) => !!isLoggedIn)
    );
  }

  getJeedomApiKey(): string {
    return this.user.jeedom;
  }

  getToken(appKey: AppKey): OauthTokensModel {
    return this.user[appKey];
  }

  login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        return this.getUser(userCredential.user);
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          throw new InvalidEmailError();
        } else if (error.code === 'auth/wrong-password' || error.code === 'auth/_user-not-found') {
          throw new WrongPasswordError();
        } else if (error.code === 'auth/too-many-requests') {
          throw new TooManyRequestError();
        } else if (error.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
          throw new WrongApiKeyError();
        } else if (error.code === 'auth/network-request-failed') {
          throw new OfflineError();
        } else {
          console.error($localize`Unknown error code`, `"${ error.code }"`);
        }
      });
  }

  async logout(): Promise<void> {
    this._user = null;
    this._isLoggedIn.next(false);
    return signOut(this.auth);
  }

  updateCode(type: AppKey, authorizationCode: string) {
    if (this._user) {
      this._user[type].authorizationCode = authorizationCode;
      return this.updateOne(this._user);
    }
    return Promise.reject();
  }

  updateRefreshToken(type: AppKey, oauthToken: OauthTokenInterface) {
    if (this._user) {
      this._user[type].refreshToken = oauthToken;
      return this.updateOne(this._user);
    }
    return Promise.reject();
  }

  updateAccessToken(type: AppKey, oauthToken: OauthTokenInterface) {
    if (this._user) {
      this._user[type].accessToken = oauthToken;
      return this.updateOne(this._user);
    }
    return Promise.reject();
  }

  private getUser(userFirebase: User) {
    return this.findOneById(userFirebase.uid).then((dataUser) => {
      if (!dataUser) {
        this._isLoggedIn.next(false);
        this.loggerService.error(new UserNotExistError());
        return;
      }

      this._user = new UserModel(dataUser);
      console.log('-- Logged with', dataUser);
      this._isLoggedIn.next(true);
    });
  }
}
