import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UiModule } from './ui.module';

const modules = [
  UiModule,
  FormsModule,
  ReactiveFormsModule,
  CommonModule,
]

@NgModule({
  declarations: [],
  imports: modules,
  exports: modules,
})
export class SharingModule {
}
