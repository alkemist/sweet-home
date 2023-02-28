import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { AppRoutingModule, SharingModule } from '@modules';
import { HeaderComponent, LoginComponent } from '@components';

import './app.database';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharingModule,
    CommonModule,
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
