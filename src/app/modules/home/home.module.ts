import { NgxPanZoomModule } from 'ngx-panzoom';
import { NgModule } from '@angular/core';
import { BlockableDivComponent, DeviceComponent, DevicesComponent, MapComponent } from './components';
import { HomeRoutingModule } from './home-routing.module';
import { SharingModule } from '../sharing.module';
import { DevicesModule } from '../devices/devices.module';

@NgModule({
  declarations: [
    MapComponent,
    DevicesComponent,
    DeviceComponent,
    BlockableDivComponent
  ],
  imports: [
    HomeRoutingModule,
    NgxPanZoomModule,
    SharingModule,
    DevicesModule,
  ]
})
export class HomeModule {
}
