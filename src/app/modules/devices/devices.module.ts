import { NgModule } from '@angular/core';
import { ThermostatAqaraComponent, ThermostatMoesComponent } from './thermostat';
import { SharingModule } from '../sharing.module';
import { OnOffPlugLidlComponent } from './on-off';

@NgModule({
  declarations: [
    ThermostatAqaraComponent,
    ThermostatMoesComponent,
    OnOffPlugLidlComponent
  ],
  imports: [
    SharingModule
  ]
})
export class DevicesModule {

}
