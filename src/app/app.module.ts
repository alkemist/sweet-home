import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { AppRoutingModule, SharingModule, UiModule } from '@modules';
import { HeaderComponent, LoginComponent } from '@components';

import './app.database';

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
