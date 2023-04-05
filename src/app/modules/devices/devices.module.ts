import { NgModule } from '@angular/core';
import { DeviceThermostatAqaraComponent, DeviceThermostatMoesComponent } from './thermostat';
import { SharingModule } from '../sharing.module';
import { DeviceOnOffLidlComponent } from './on-off';
import { DeviceChromecastComponent, DeviceSonosComponent } from './multimedia';
import { DeviceThermometerAqaraComponent } from './thermometer';

@NgModule({
  declarations: [
    DeviceThermostatAqaraComponent,
    DeviceThermostatMoesComponent,
    DeviceThermometerAqaraComponent,
    DeviceOnOffLidlComponent,
    DeviceChromecastComponent,
    DeviceSonosComponent
  ],
  imports: [
    SharingModule,
  ]
})
export class DevicesModule {

}
