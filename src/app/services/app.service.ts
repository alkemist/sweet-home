import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { SmartLoaderModel } from '../models/smart-loader.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private loaderManager = new SmartLoaderModel();
  private pageTitle: string | undefined = undefined;

  constructor(private readonly titleService: Title) {

  }

  get globalLoader() {
    return this.loaderManager.globalLoader;
  }

  get allLoaders() {
    return this.loaderManager.allLoaders;
  }

  addLoader() {
    return this.loaderManager.addLoader();
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
