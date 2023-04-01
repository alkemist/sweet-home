import { isDevMode, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AuthorizeComponent, HeaderComponent } from '@components';

import './app.database';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './modules/app-routing.module';
import { StoringModule } from './modules/storing.module';
import { SharingModule } from './modules/sharing.module';
import { ServiceWorkerModule } from '@angular/service-worker';

import { Buffer } from "buffer";
import { LoginComponent } from './components/pages/authorize/login.component';

window.Buffer = window.Buffer || Buffer;

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthorizeComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    StoringModule,
    SharingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
