import { DeviceModel, DeviceStoredInterface } from '@models';
import { inject, Injectable } from '@angular/core';
import { AddDevice, DeviceState, FillDevices, InvalideDevices, RemoveDevice, UpdateDevice } from '@stores';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { JeedomService } from './jeedom.service';
import { LoggerService } from './logger.service';
import { DataStoreService } from './data-store.service';


@Injectable({
  providedIn: 'root'
})
export class DeviceService extends DataStoreService<DeviceStoredInterface, DeviceModel> {
  @Select(DeviceState.lastUpdated) override lastUpdated$?: Observable<Date>;
  // Données du store
  @Select(DeviceState.all) protected override all$?: Observable<DeviceStoredInterface[]>;

  constructor(logger: LoggerService,
              store: Store,
              jeedomService: JeedomService) {
    super(logger, 'device', DeviceModel, store,
      AddDevice, UpdateDevice, RemoveDevice, FillDevices, InvalideDevices);

    /*this.jeedomService.request("version").then((response) => {
      console.log(response);
    });*/
  }
}

export const deviceResolver: ResolveFn<DeviceModel | undefined> =
  (route: ActivatedRouteSnapshot) => {
    return inject(DeviceService).getBySlug(route.paramMap.get('slug')!);
  };
