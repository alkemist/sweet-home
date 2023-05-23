import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from "@angular/core";
import {UserService} from "@services";
import BaseComponent from "@base-component";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
	host: {
		class: "page-container"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends BaseComponent implements OnInit, OnDestroy {
	/*form = new FormGroup<UserFormInterface>({
		email: new FormControl<string | null>("", []),
		password: new FormControl<string | null>("", []),
	});*/
	error: string = "";

	/*constructor(private userService: UserService, private router: Router, private messageService: MessageService) {
		super();
	}*/

	constructor(private userService: UserService) {
		super();
	}

	/*get email(): FormControl<string> {
		return this.form.get("email") as FormControl<string>;
	}

	get password(): FormControl<string> {
		return this.form.get("password") as FormControl<string>;
	}*/

	ngOnInit(): void {

	}

	handleSubmit() {
		//this.form.markAllAsTouched();

		/*if (this.email.value && this.password.value) {
			this.userService.login(this.email.value, this.password.value)
				.then(_ => {
					this.messageService.add({
						severity: "success",
						detail: `${$localize`Successfully logged`}`
					});
					void this.router.navigate(["../home"]);
				})
				.catch((error) => {
					this.error = (error as Error).message;
				});
		} else if (this.email.value && !this.password.value) {
			this.userService.sendLoginLink(this.email.value).then(_ => {
				this.messageService.add({
					severity: "success",
					detail: `${$localize`Login link sended`}`
				});
			});
		} else {
			void this.userService.loginWithProvider();
		}*/
		void this.userService.loginWithProvider();
	}
}
