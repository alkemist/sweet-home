import { NgModule } from '@angular/core';
import { DeviceComponent, DevicesComponent, MapComponent, ScenariosComponent } from './components';
import { HomeRoutingModule } from './home-routing.module';
import { SharingModule } from '../shared/sharing.module';
import { DevicesModule } from '../devices/devices.module';
import { HistoriesComponent } from './components/pages/histories/histories.component';

@NgModule({
  declarations: [
    MapComponent,
    DevicesComponent,
    DeviceComponent,
    HistoriesComponent,
    ScenariosComponent,
  ],
  imports: [
    HomeRoutingModule,
    SharingModule,
    DevicesModule,
  ]
})
export class HomeModule {
}
