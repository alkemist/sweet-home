import { NgModule } from '@angular/core';
import { ConfirmationService, FilterService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ValdemortModule } from 'ngx-valdemort';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

const modules = [
  ToolbarModule,

  CardModule,
  InputTextModule,
  ButtonModule,
  ToastModule,
  RippleModule,
  TieredMenuModule,
  TableModule,
  MultiSelectModule,
  AutoCompleteModule,
  DropdownModule,
  InputNumberModule,
  ConfirmDialogModule,

  ValdemortModule,
];

@NgModule({
  imports: modules,
  exports: modules,
  providers: [ ConfirmationService, MessageService, DialogService, FilterService ],
})
export class UiModule {
}
