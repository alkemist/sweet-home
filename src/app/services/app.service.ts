import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private pageTitle: string | undefined = undefined;

  constructor(private readonly titleService: Title) {

  }

  private _loading$ = new Subject<boolean>();

  get loading$() {
    return this._loading$.asObservable();
  }

  beginLoading() {
    this._loading$.next(true);
  }

  endLoading() {
    this._loading$.next(false);
  }

  setTitle(title: string | undefined) {
    if (this.pageTitle !== title) {
      this.pageTitle = title;

      if (title !== undefined) {
        this.titleService.setTitle(`${ process.env['APP_NAME'] } - ${ title }`);
      } else {
        this.titleService.setTitle(`${ process.env['APP_NAME'] }`);
      }
    }
  }

  setSubTitle(subTitle?: string) {
    if (subTitle !== undefined) {
      this.titleService.setTitle(`${ process.env['APP_NAME'] } - ${ this.pageTitle } - ${ subTitle }`);
    } else {
      this.titleService.setTitle(`${ process.env['APP_NAME'] } - ${ this.pageTitle }`);
    }
  }
}
