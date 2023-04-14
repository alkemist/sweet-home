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
      developmentMode: !!parseInt(process.env['APP_DEBUG'] ?? '0')
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: !parseInt(process.env['APP_DEBUG'] ?? '0'),
    }),
    NgxsLoggerPluginModule.forRoot({
      disabled: !parseInt(process.env['APP_DEBUG'] ?? '0'),
    }),
    NgxsStoragePluginModule.forRoot()
  ],
  exports: [
    NgxsModule
  ],
})
export class StoringModule {
}
