import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, SharingModule } from '@modules';
import { AppComponent } from './app.component';
import { LoginComponent } from '@components';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UiModule } from '@app/modules/ui.module';
import { HeaderComponent } from '@app/components/layouts';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SharingModule,
    CommonModule,
    UiModule,
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
