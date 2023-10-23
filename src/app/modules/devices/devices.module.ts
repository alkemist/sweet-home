import { NgModule } from '@angular/core';
import {
  DeviceOnOffLidlComponent,
  DeviceOnOffMoesComponent,
  DeviceOnOffNousComponent,
  DeviceOnOffSchneiderComponent,
  DeviceThermometerAqaraComponent,
  DeviceThermostatAqaraComponent,
  DeviceThermostatMoesComponent
} from './zigbee';
import { SharingModule } from '../sharing.module';
import { DeviceChromecastComponent, DeviceSonosComponent } from './wifi';
import { DeviceTestComponent } from './test.component';
import { DeviceLightEgloComponent } from './zigbee/light/eglo/light-eglo.component';

@NgModule({
  declarations: [
    DeviceThermostatAqaraComponent,
    DeviceThermostatMoesComponent,
    DeviceThermometerAqaraComponent,
    DeviceOnOffLidlComponent,
    DeviceOnOffMoesComponent,
    DeviceOnOffNousComponent,
    DeviceOnOffSchneiderComponent,
    DeviceLightEgloComponent,
    DeviceChromecastComponent,
    DeviceSonosComponent,
    DeviceTestComponent
  ],
  imports: [
    SharingModule,
  ]
})
export class DevicesModule {

}
