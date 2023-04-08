import { NgModule } from '@angular/core';
import {
  DeviceOnOffLidlComponent,
  DeviceThermometerAqaraComponent,
  DeviceThermostatAqaraComponent,
  DeviceThermostatMoesComponent
} from './zigbee';
import { SharingModule } from '../sharing.module';
import { DeviceChromecastComponent, DeviceSonosComponent } from './wifi';

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
