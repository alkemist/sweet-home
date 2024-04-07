import { Title } from "@angular/platform-browser";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import "../global"
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: "root"
})
export class AppService {
  private pageTitle: string | undefined = undefined;

  constructor(
    private messageService: MessageService,
    private readonly titleService: Title
  ) {
  }

  setTitle(title: string | undefined) {
    if (this.pageTitle !== title) {
      this.pageTitle = title;

      if (title !== undefined) {
        this.titleService.setTitle(`${ title }`);
      } else {
        this.titleService.setTitle(`${ environment["APP_NAME"] }`);
      }
    }
  }

  setSubTitle(subTitle?: string) {
    if (subTitle !== undefined) {
      this.titleService.setTitle(`${ this.pageTitle } - ${ subTitle }`);
    } else {
      this.titleService.setTitle(`${ this.pageTitle }`);
    }
  }

  showToast(severity: "success" | "warn" | "error", message: string) {
    this.messageService.add({
      severity: severity,
      detail: message
    });
  }
}
