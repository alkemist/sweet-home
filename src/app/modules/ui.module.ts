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
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';

import { ValdemortModule } from 'ngx-valdemort';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SliderModule } from 'primeng/slider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';

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
  DialogModule,
  BlockUIModule,
  ProgressSpinnerModule,
  InputSwitchModule,
  OverlayPanelModule,
  SliderModule,
  ToggleButtonModule,
  SelectButtonModule,
  CalendarModule,
  ChipsModule,
  SidebarModule,
  PanelMenuModule,

  ValdemortModule,
];


@NgModule({
  imports: modules,
  exports: modules,
  providers: [ ConfirmationService, MessageService, DialogService, FilterService ],
})
export class UiModule {
}
