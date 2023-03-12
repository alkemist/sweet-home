import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from '@app/modules/home/components/pages/map/map.component';
import { DevicesComponent } from '@app/modules/home/components/pages/devices/devices.component';
import { deviceResolver } from '@services';
import { DeviceComponent } from '@app/modules/home/components/pages/device/device.component';

const routes: Routes = [
  { path: '', component: MapComponent, title: 'Map' },
  { path: 'devices', component: DevicesComponent, title: 'Devices' },
  { path: 'devices/add', component: DeviceComponent, title: 'Device' },
  { path: 'devices/:slug', component: DeviceComponent, title: 'Device', resolve: { device: deviceResolver } },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class HomeRoutingModule {
}
