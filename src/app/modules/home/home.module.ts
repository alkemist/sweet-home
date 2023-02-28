import { NgModule } from '@angular/core';
import { SharingModule } from '@app/modules/sharing.module';
import { HomeRoutingModule } from '@app/modules/home/home-routing.module';
import { MapComponent } from '@app/modules/home/components/pages/map/map.component';
import { DevicesComponent } from '@app/modules/home/components/pages/devices/devices.component';

@NgModule({
  declarations: [
    MapComponent,
    DevicesComponent
  ],
  imports: [
    HomeRoutingModule,
    SharingModule,
  ]
})
export class HomeModule {
}
