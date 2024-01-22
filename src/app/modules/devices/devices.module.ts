import { NgModule } from '@angular/core';
import {
  DeviceOnOffLidlComponent,
  DeviceOnOffMoesComponent,
  DeviceOnOffNousComponent,
  DeviceOnOffSchneiderComponent,
  DevicePresenceSonoffComponent,
  DeviceThermometerAqaraComponent,
  DeviceThermostatAqaraComponent,
  DeviceThermostatMoesComponent
} from './zigbee';
import { SharingModule } from '../shared/sharing.module';
import { DeviceChromecastComponent, DeviceSonosComponent } from './wifi';
import { DeviceTestComponent } from './test.component';
import { DeviceLightEgloComponent } from './zigbee/light/eglo/light-eglo.component';
import { DeviceThermometerSonoffComponent } from './zigbee/thermometer/sonoff/thermometer-sonoff.component';
import { ChartModule } from 'primeng/chart';
import { DeviceLightPhilipsComponent } from './zigbee/light/philips/light-philips.component';

@NgModule({
  declarations: [
    DeviceThermostatAqaraComponent,
    DeviceThermostatMoesComponent,
    DeviceThermometerAqaraComponent,
    DeviceThermometerSonoffComponent,
    DeviceOnOffLidlComponent,
    DeviceOnOffMoesComponent,
    DeviceOnOffNousComponent,
    DeviceOnOffSchneiderComponent,
    DevicePresenceSonoffComponent,
    DeviceLightEgloComponent,
    DeviceLightPhilipsComponent,
    DeviceChromecastComponent,
    DeviceSonosComponent,
    DeviceTestComponent,
  ],
  imports: [
    ChartModule,
    SharingModule,
  ]
})
export class DevicesModule {

}
