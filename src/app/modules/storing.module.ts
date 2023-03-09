import { NgModule } from '@angular/core';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { DeviceState } from '@stores';


const states = [
  DeviceState
];

@NgModule({
  imports: [
    NgxsModule.forRoot(states, {
      developmentMode: !!process.env['APP_DEBUG']
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: !process.env['APP_DEBUG'],
    }),
    NgxsLoggerPluginModule.forRoot({
      disabled: !process.env['APP_DEBUG'],
    }),
    NgxsStoragePluginModule.forRoot()
  ],
  exports: [
    NgxsModule
  ],
})
export class StoringModule {
}
