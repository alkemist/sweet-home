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
import { Title } from '@angular/platform-browser';
import { UserService } from '@services';
import { map, Observable } from 'rxjs';

const logginInGuard: CanActivateFn = (): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const userService = inject(UserService);
  const router = inject(Router);
  return userService.isLoggedIn().pipe(map(isLogged => isLogged ? router.parseUrl('/home') : true));
};
const loggedInGuard: CanActivateFn = (): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const userService = inject(UserService);
  const router = inject(Router);
  return userService.isLoggedIn().pipe(map(isLogged => isLogged ?? router.parseUrl('/')));
};

const routes: Routes = [
  {
    path: '',
    canActivate: [ logginInGuard ],
    component: LoginComponent,
    title: 'Login'
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
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`${ process.env['APP_NAME'] } - ${ title }`);
    }
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
