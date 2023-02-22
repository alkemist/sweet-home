import { UserInterface } from '@app/models/user.interface';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  getLoggedUser(): Observable<UserInterface | undefined> {
    return of(undefined);
  }

  isLoggedIn(): boolean {
    return false;
  }

  login(email: string, password: string): Promise<UserInterface | undefined> {
    return new Promise((resolve, reject) => {
      resolve(undefined);
    });
  }
}
