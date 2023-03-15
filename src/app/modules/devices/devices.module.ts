import { NgModule } from '@angular/core';
import { SharingModule } from '@modules';
import { ThermostatAqaraComponent } from './thermostats';

@NgModule({
  declarations: [
    ThermostatAqaraComponent
  ],
  imports: [
    SharingModule,
  ]
})
export class DevicesModule {
}
