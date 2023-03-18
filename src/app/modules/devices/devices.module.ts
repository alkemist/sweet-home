import { NgModule } from '@angular/core';
import { ThermostatAqaraComponent } from './thermostats';
import { SharingModule } from '../sharing.module';

@NgModule({
  declarations: [
    ThermostatAqaraComponent
  ],
  imports: [
    SharingModule
  ]
})
export class DevicesModule {

}
