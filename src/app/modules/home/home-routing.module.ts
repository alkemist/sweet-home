import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from '@app/modules/home/components/pages/map/map.component';

const routes: Routes = [
  { path: '', component: MapComponent },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class HomeRoutingModule {
}
