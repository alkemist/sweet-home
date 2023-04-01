import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UiModule } from './ui.module';
import { HttpClientModule } from '@angular/common/http';

const modules = [
  UiModule,
  FormsModule,
  ReactiveFormsModule,
  CommonModule,
  HttpClientModule,
]

@NgModule({
  declarations: [],
  imports: modules,
  exports: modules,
})
export class SharingModule {
}
