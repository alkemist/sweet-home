import { DeviceComponent, DevicesComponent, MapComponent } from "./components";
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { HistoriesComponent } from './components/pages/histories/histories.component';
import { deviceResolver } from '@services';


const routes: Routes = [
  { path: "", component: MapComponent, title: "Map" },
  { path: "histories", component: HistoriesComponent, title: "Histories" },
  { path: "devices", component: DevicesComponent, title: "Devices" },
  { path: "devices/add", component: DeviceComponent, title: "Device" },
  { path: "devices/:slug", component: DeviceComponent, title: "Device", resolve: { device: deviceResolver } },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class HomeRoutingModule {
}
