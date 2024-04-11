import { Title } from "@angular/platform-browser";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import "../global"
import { MessageService } from 'primeng/api';
import packageJson from '../../../package.json';

@Injectable({
  providedIn: "root"
})
export class AppService {
  public version: string = packageJson.version;
  private pageTitle: string | undefined = undefined;
  private pageSubTitle: string | undefined = undefined;

  constructor(
    private messageService: MessageService,
    private readonly titleService: Title
  ) {
  }

  getTitle() {
    const pageTitle = this.pageTitle ?? environment["APP_NAME"];

    return this.pageSubTitle ? `${ pageTitle } - ${ this.pageSubTitle }` : pageTitle;
  }

  setTitle(title: string | undefined) {
    if (this.pageTitle !== title) {
      this.pageTitle = title;

      if (title !== undefined) {
        this.titleService.setTitle(`${ title } - ${ this.version }`);
      } else {
        this.titleService.setTitle(`${ environment["APP_NAME"] } - ${ this.version }`);
      }
    }
  }

  setSubTitle(subTitle?: string) {
    this.pageSubTitle = subTitle;

    if (subTitle !== undefined) {
      this.titleService.setTitle(`${ this.pageTitle } - ${ subTitle } - ${ this.version }`);
    } else {
      this.titleService.setTitle(`${ this.pageTitle } - ${ this.version }`);
    }
  }
}
