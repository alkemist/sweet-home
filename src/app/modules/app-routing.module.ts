import { Injectable, NgModule } from "@angular/core";
import { RouterModule, RouterStateSnapshot, Routes, TitleStrategy } from "@angular/router";
import { AuthorizeComponent } from "@components";
import { AppService } from "@services";
import { LoginComponent } from "../components/pages/login/login.component";
import { loggedInGuard, logginInGuard } from '@alkemist/ngx-data-store';

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "login",
    canActivate: [ logginInGuard ],
    component: LoginComponent,
    title: "Login",
  },
  {
    path: "authorize/:type",
    canActivate: [ logginInGuard ],
    component: AuthorizeComponent,
    title: "Authorization",
  },
  {
    path: "home",
    canActivate: [ loggedInGuard ],
    loadChildren: () => import("./home")
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
