import {Component, OnDestroy, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "@services";
import {UserFormInterface} from "@models";
import BaseComponent from "@base-component";
import {MessageService} from "primeng/api";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
	host: {
		class: "page-container"
	}
})
export class LoginComponent extends BaseComponent implements OnInit, OnDestroy {
	form = new FormGroup<UserFormInterface>({
		email: new FormControl<string | null>("", [
			Validators.required,
			Validators.email,
		]),
		password: new FormControl<string | null>("", []),
	});
	error: string = "";

	constructor(private userService: UserService, private router: Router, private messageService: MessageService) {
		super();

		if (process.env["APP_AUTO_LOGIN"] && process.env["APP_AUTO_PASSWORD"]) {
			this.form.setValue({
				email: process.env["APP_AUTO_LOGIN"],
				password: process.env["APP_AUTO_PASSWORD"]
			});
		}
	}

	get email(): FormControl<string> {
		return this.form.get("email") as FormControl<string>;
	}

	get password(): FormControl<string> {
		return this.form.get("password") as FormControl<string>;
	}

	ngOnInit(): void {

	}

	handleSubmit() {
		this.form.markAllAsTouched();

		if (this.form.valid && this.form.value.email && this.form.value.password) {
			try {
				this.userService.login(this.form.value.email, this.form.value.password).then(_ => this.afterLogin());
			} catch (error) {
				this.error = (error as Error).message;
			}
		} else if (this.form.valid && this.form.value.email && !this.form.value.password) {
			this.userService.sendLoginLink(this.form.value.email).then(_ => this.afterLogin());
		} else {
			this.userService.loginWithProvider().then(_ => this.afterLogin());
		}
	}

	private afterLogin() {
		this.messageService.add({
			severity: "success",
			detail: `${$localize`Successfully logged`}`
		});
		void this.router.navigate(["../home"]);
	}
}
