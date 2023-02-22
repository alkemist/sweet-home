import { NgModule } from '@angular/core';
import { SharingModule } from '@app/modules/sharing.module';
import { HomeRoutingModule } from '@app/modules/home/home-routing.module';
import { MapComponent } from '@app/modules/home/components/pages/map/map.component';

@NgModule({
  declarations: [
    MapComponent
  ],
  imports: [
    HomeRoutingModule,
    SharingModule,
  ]
})
export class HomeModule {
}
