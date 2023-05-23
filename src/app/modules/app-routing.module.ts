import {inject, Injectable, NgModule} from "@angular/core";
import {CanActivateFn, Router, RouterModule, RouterStateSnapshot, Routes, TitleStrategy, UrlTree} from "@angular/router";
import {AuthorizeComponent} from "@components";
import {AppService, UserService} from "@services";
import {map, Observable} from "rxjs";
import {LoginComponent} from "../components/pages/authorize/login.component";
import {MessageService} from "primeng/api";

const logginInGuard: CanActivateFn = (): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
	const userService = inject(UserService);
	const messageService = inject(MessageService);
	const router = inject(Router);
	return userService.isLoggedIn().pipe(map(isLogged => {
		let loginWithProvider = window.localStorage.getItem("loginWithProvider");


		if (isLogged) {
			if (loginWithProvider) {
				window.localStorage.removeItem("loginWithProvider");
				messageService.add({
					severity: "success",
					detail: `${$localize`Successfully logged`}`
				});
			}
			void router.navigate(["/home"]);
		}
		return !isLogged;
	}));
};
const loggedInGuard: CanActivateFn = (): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
	const userService = inject(UserService);
	const router = inject(Router);
	return userService.isLoggedIn().pipe(map(isLogged => {
		if (!isLogged) {
			router.navigate(["/login"]);
		}
		return isLogged;
	}));
};

const routes: Routes = [
	{path: "", redirectTo: "login", pathMatch: "full"},
	{
		path: "login",
		canActivate: [logginInGuard],
		component: LoginComponent,
		title: "Login",
	},
	{
		path: "authorize/:type",
		canActivate: [logginInGuard],
		component: AuthorizeComponent,
		title: "Authorization",
	},
	{
		path: "home",
		canActivate: [loggedInGuard],
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
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
	providers: [
		{
			provide: TitleStrategy,
			useClass: TemplatePageTitleStrategy
		}
	]
})
export class AppRoutingModule {
}
