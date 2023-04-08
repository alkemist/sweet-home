import { NgModule } from '@angular/core';
import {
  DeviceOnOffLidlComponent,
  DeviceOnOffMoesComponent,
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
    DeviceOnOffMoesComponent,
    DeviceChromecastComponent,
    DeviceSonosComponent
  ],
  imports: [
    SharingModule,
  ]
})
export class DevicesModule {

}
