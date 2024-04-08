import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import BaseComponent from "@base-component";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
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
  error: string = "";
  enableForm = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  handleSubmit() {
    this.userService.login();
  }
}
