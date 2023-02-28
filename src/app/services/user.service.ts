import { UserInterface } from '@app/models/user.interface';
import { BehaviorSubject, filter, map, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { FirestoreService } from '@app/services/firestore.service';
import { userConverter } from '@converters';
import { LoggerService } from '@app/services/logger.service';
import { InvalidEmailError, OfflineError, TooManyRequestError, WrongApiKeyError, WrongPasswordError } from '@errors';
import { UserModel } from '@models';


@Injectable({
  providedIn: 'root'
})
export class UserService extends FirestoreService<UserInterface, UserModel> {
  private _auth = getAuth();
  private _isLoggedIn: BehaviorSubject<boolean | null>;
  private _user: UserModel | null = null;
  private _token: string = '';

  constructor(private logger: LoggerService) {
    super(logger, 'user', userConverter, UserModel);
    this._isLoggedIn = new BehaviorSubject<boolean | null>(null);

    onAuthStateChanged(this._auth, (userFirebase) => {
      if (!userFirebase) {
        this._isLoggedIn.next(false);
      } else {
        this.findOneById(userFirebase.uid).then((dataUser) => {
          if (!dataUser) {
            this._isLoggedIn.next(false);
            // @TODO Create custom error
            throw new Error();
          }

          this._user = new UserModel(dataUser);
          this._token = dataUser.token;
          this._isLoggedIn.next(true);
        });
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
      // @TODO Create custom error
      throw new Error();
    }

    return this._token
  }

  login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this._auth, email, password)
      .then(() => {
        return;
      })
      .catch((error) => {
        if (error.code === '_auth/invalid-email') {
          throw new InvalidEmailError();
        } else if (error.code === '_auth/wrong-password' || error.code === '_auth/_user-not-found') {
          throw new WrongPasswordError();
        } else if (error.code === '_auth/too-many-requests') {
          throw new TooManyRequestError();
        } else if (error.code === '_auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
          throw new WrongApiKeyError();
        } else if (error.code === '_auth/network-request-failed') {
          throw new OfflineError();
        } else {
          console.error('Unknown error code', error.code);
        }
      });
  }

  async logout(): Promise<void> {
    return signOut(this._auth);
  }
}
