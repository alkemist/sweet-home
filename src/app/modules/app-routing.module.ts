import { Injectable, NgModule } from '@angular/core';
import { RouterModule, RouterStateSnapshot, Routes, TitleStrategy } from '@angular/router';
import { LoginComponent } from '@components';
import { LoggedGuard, LoginGuard } from '@guards';
import { Title } from '@angular/platform-browser';

const routes: Routes = [
  {
    path: '',
    canActivate: [ LoginGuard ],
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'home',
    canActivate: [ LoggedGuard ],
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
