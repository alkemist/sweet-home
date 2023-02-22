import { NgModule } from '@angular/core';
import { ConfirmationService, FilterService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';

const modules = [
  ToolbarModule,

  CardModule,
  InputTextModule,
  ButtonModule,
  ToastModule,
  RippleModule
];

@NgModule({
  imports: modules,
  exports: modules,
  providers: [ ConfirmationService, MessageService, DialogService, FilterService ],
})
export class UiModule {
}
