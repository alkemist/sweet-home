import { inject, Injectable, NgModule } from '@angular/core';
import {
  CanActivateFn,
  Router,
  RouterModule,
  RouterStateSnapshot,
  Routes,
  TitleStrategy,
  UrlTree
} from '@angular/router';
import { LoginComponent } from '@components';
import { UserService } from '@services';
import { map, Observable } from 'rxjs';
import { AppService } from '@app/services/app.service';

const logginInGuard: CanActivateFn = (): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const userService = inject(UserService);
  const router = inject(Router);
  return userService.isLoggedIn().pipe(map(isLogged => {
    if (isLogged) {
      router.navigate([ '/home' ]);
    }
    return !isLogged;
  }));
};
const loggedInGuard: CanActivateFn = (): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const userService = inject(UserService);
  const router = inject(Router);
  return userService.isLoggedIn().pipe(map(isLogged => {
    if (!isLogged) {
      router.navigate([ '/login' ]);
    }
    return isLogged;
  }));
};

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [ logginInGuard ],
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'home',
    canActivate: [ loggedInGuard ],
    loadChildren: () => import('./home')
      .then(mod => mod.HomeModule)
  },
];

@Injectable()
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly appService: AppService) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    this.appService.setTitle(title);
  }
}

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [
    {
      provide: TitleStrategy,
      useClass: TemplatePageTitleStrategy
    }
  ]
})
export class AppRoutingModule {
}
