import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import BaseComponent from "@base-component";
import { UserService } from '@services';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: [ "./login.component.scss" ],
  host: {
    class: "page-container"
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends BaseComponent implements OnInit, OnDestroy {
  constructor(
    private userService: UserService,
  ) {
    super();
  }

  ngOnInit(): void {
  }

  handleSubmit() {
    this.userService.login();
  }
}
