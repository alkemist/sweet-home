import { UserInterface } from '@app/models/user.interface';
import { BehaviorSubject, filter, map, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { FirestoreService } from '@app/services/firestore.service';
import { LoggerService } from '@app/services/logger.service';
import { InvalidEmailError, OfflineError, TooManyRequestError, WrongApiKeyError, WrongPasswordError } from '@errors';
import { UserModel } from '@models';


@Injectable({
  providedIn: 'root'
})
export class UserService extends FirestoreService<UserInterface, UserModel> {
  private auth = getAuth();
  private _isLoggedIn: BehaviorSubject<boolean | null>;
  private _user: UserModel | null = null;
  private _token: string = '';

  constructor(private logger: LoggerService) {
    super(logger, 'user', UserModel);
    this._isLoggedIn = new BehaviorSubject<boolean | null>(null);

    onAuthStateChanged(this.auth, (userFirebase) => {
      if (!userFirebase) {
        this._isLoggedIn.next(false);
      } else {
        this.getUser(userFirebase);
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
        // @TODO Create custom error
        throw new Error();
      }

      this._user = new UserModel(dataUser);
      this._token = dataUser.token;
      this._isLoggedIn.next(true);
    });
  }
}
