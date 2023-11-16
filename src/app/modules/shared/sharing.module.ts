import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UiModule } from '../ui.module';
import { HttpClientModule } from '@angular/common/http';
import { BlockableDivComponent } from './components/blockable-div/blockable-div.component';
import { HistoryComponent } from './components/history/history.component';
import { ChartModule } from 'primeng/chart';

const modules = [
  UiModule,
  FormsModule,
  ReactiveFormsModule,
  CommonModule,
  HttpClientModule,
]

@NgModule({
  declarations: [
    BlockableDivComponent,
    HistoryComponent
  ],
  imports: [
    modules,
    ChartModule
  ],
  exports: [
    ...modules,
    BlockableDivComponent,
    HistoryComponent
  ],
})
export class SharingModule {
}
