import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from "@angular/core";
import {UserService} from "@services";
import BaseComponent from "@base-component";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";
import {UserFormInterface} from "@models";
import {MessageService} from "primeng/api";

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
  form = new FormGroup<UserFormInterface>({
    email: new FormControl<string | null>("", []),
    password: new FormControl<string | null>("", []),
  });
  error: string = "";
  enableForm = false;

  constructor(private userService: UserService, private router: Router,
              private route: ActivatedRoute, private messageService: MessageService) {
    super();
  }

  get email(): FormControl<string> {
    return this.form.get("email") as FormControl<string>;
  }

  get password(): FormControl<string> {
    return this.form.get("password") as FormControl<string>;
  }

  ngOnInit(): void {
    this.userService.checkLoginWithProvider().then(() => {
      void this.router.navigate(["../", "home"], {relativeTo: this.route});
    }).catch(() => {

    });
  }

  handleSubmit() {
    this.form.markAllAsTouched();

    if (this.enableForm) {
      if (this.email.value && this.password.value) {
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
      }
    } else {
      void this.userService.loginWithProvider();
    }
  }
}
