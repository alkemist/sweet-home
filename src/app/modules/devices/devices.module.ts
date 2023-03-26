import { NgModule } from '@angular/core';
import { ThermostatAqaraComponent, ThermostatMoesComponent } from './thermostats';
import { SharingModule } from '../sharing.module';

@NgModule({
  declarations: [
    ThermostatAqaraComponent,
    ThermostatMoesComponent
  ],
  imports: [
    SharingModule
  ]
})
export class DevicesModule {

}
