import { importProvidersFrom, isDevMode, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AuthorizeComponent, HeaderComponent } from '@components';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './modules/app-routing.module';
import { SharingModule } from './modules/shared/sharing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LoginComponent } from './components/pages/login/login.component';
import { TranslateModule } from '@ngx-translate/core';
import { DataStoreModule } from '@alkemist/ngx-data-store';
import { environment } from '../environments/environment';

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
    SharingModule,
    TranslateModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode() && typeof window['cordova'] === 'undefined',
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    importProvidersFrom(DataStoreModule.forRoot({
      api_datastore_base_url: 'https://localhost:8000/',
      api_project_key: 'sweet-home',
      front_callback_path: 'authorize/google',
      front_logged_path: '/home',
      front_login_path: '/',
      local_storage_auth_key: 'token',
      store_default_max_hour_outdated: 1,
      offline_mode: environment['APP_OFFLINE']
    }))
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
