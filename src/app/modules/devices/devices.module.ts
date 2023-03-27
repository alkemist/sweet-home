import { NgModule } from '@angular/core';
import { DeviceThermostatAqaraComponent, DeviceThermostatMoesComponent } from './thermostat';
import { SharingModule } from '../sharing.module';
import { DeviceOnOffPlugLidlComponent } from './on-off';
import { DeviceChromecastComponent, DeviceSonosComponent } from './multimedia';

@NgModule({
  declarations: [
    DeviceThermostatAqaraComponent,
    DeviceThermostatMoesComponent,
    DeviceOnOffPlugLidlComponent,
    DeviceChromecastComponent,
    DeviceSonosComponent
  ],
  imports: [
    SharingModule
  ]
})
export class DevicesModule {

}
