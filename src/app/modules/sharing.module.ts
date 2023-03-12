import { NgModule } from '@angular/core';
import { UiModule } from '@app/modules/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
