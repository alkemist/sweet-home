import { NgModule } from "@angular/core";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { NgxsStoragePluginModule } from "@ngxs/storage-plugin";
import { NgxsModule } from "@ngxs/store";
import { DeviceState } from "@stores";
import { environment } from "../../environments/environment";
import { StateManager } from '@alkemist/ng-state-manager';


const states = [
  DeviceState
];

@NgModule({
  imports: [
    NgxsModule.forRoot(states, {
      developmentMode: environment["APP_DEBUG"]
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: !environment["APP_DEBUG"],
    }),
    NgxsLoggerPluginModule.forRoot({
      disabled: !environment["APP_DEBUG"],
    }),
    NgxsStoragePluginModule.forRoot(),
    //StateManagerModule,
    //StateManagerModule.forRoot(),
  ],
  providers: [
    StateManager
  ],
  exports: [
    NgxsModule
  ],
})
export class StoringModule {
}
