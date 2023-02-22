import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserService } from '@services';

@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    // returns `true` if the user is logged in or redirects to the login page
    // note that you can also use `router.createUrlTree()` to build a `UrlTree` with parameters
    return this.userService.isLoggedIn() || this.router.parseUrl('/');
  }

}
