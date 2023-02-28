import { NgModule } from '@angular/core';
import { UiModule } from '@app/modules/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const modules = [
  UiModule,
  FormsModule,
  ReactiveFormsModule,
]

@NgModule({
  declarations: [],
  imports: modules,
  exports: modules,
})
export class SharingModule {
}
