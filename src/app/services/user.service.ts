import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, of } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { UserInterface, UserModel } from '@models';
import { InvalidEmailError, OfflineError, TooManyRequestError, WrongApiKeyError, WrongPasswordError } from '@errors';
import { LoggerService } from './logger.service';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { MessageService } from 'primeng/api';
import { UserNotLoggedError } from '../errors/user-not-logged.error';
import { UserNotExistError } from '../errors/user-not-exist.error';


@Injectable({
  providedIn: 'root'
})
export class UserService extends FirestoreService<UserInterface, UserModel> {
  private auth = getAuth();
  private _isLoggedIn: BehaviorSubject<boolean | null>;
  private _user: UserModel | null = null;
  private _token: string = '';

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

  isLoggedIn(): Observable<boolean> {
    if (this._user) {
      return of(true);
    }

    return this._isLoggedIn.asObservable().pipe(
      filter((isLoggedIn) => isLoggedIn !== null),
      map((isLoggedIn) => !!isLoggedIn)
    );
  }

  getUserToken(): string {
    if (!this._user) {
      this.loggerService.error(new UserNotLoggedError());
    }

    return this._token
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

  private getUser(userFirebase: User) {
    return this.findOneById(userFirebase.uid).then((dataUser) => {
      if (!dataUser) {
        this._isLoggedIn.next(false);
        this.loggerService.error(new UserNotExistError());
        return;
      }

      this._user = new UserModel(dataUser);
      this._token = dataUser.token;
      this._isLoggedIn.next(true);
    });
  }
}
