import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from '@app/modules/home/components/pages/map/map.component';
import { DevicesComponent } from '@app/modules/home/components/pages/devices/devices.component';

const routes: Routes = [
  { path: '', component: MapComponent, title: 'Map' },
  { path: 'devices', component: DevicesComponent, title: 'Devices' },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class HomeRoutingModule {
}
