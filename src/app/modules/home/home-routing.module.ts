import { DeviceComponent, DevicesComponent, MapComponent, ScenariosComponent } from "./components";
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { HistoriesComponent } from './components/pages/histories/histories.component';
import { deviceGetResolver } from '@services';
import { VariablesComponent } from './components/pages/variables/variables.component';


const routes: Routes = [
  { path: "", component: MapComponent, title: "Map" },
  { path: "histories", component: HistoriesComponent, title: "Histories" },
  { path: "scenarios", component: ScenariosComponent, title: "Scenarios" },
  { path: "variables", component: VariablesComponent, title: "Variables" },
  { path: "devices", component: DevicesComponent, title: "Devices" },
  { path: "devices/add", component: DeviceComponent, title: "Device" },
  { path: "devices/:slug", component: DeviceComponent, title: "Device", resolve: { device: deviceGetResolver } },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class HomeRoutingModule {
}
