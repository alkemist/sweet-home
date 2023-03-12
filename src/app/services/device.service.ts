import { inject, Injectable } from '@angular/core';
import { LoggerService } from '@app/services/logger.service';
import { DeviceStoredInterface } from '@app/models/device.interface';
import { JeedomService } from '@app/services/jeedom.service';
import { DeviceModel } from '@models';
import { DataStoreService } from '@app/services/data-store.service';
import { AddDevice, DeviceState, FillDevices, InvalideDevices, RemoveDevice, UpdateDevice } from '@stores';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';


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
  }
}

export const deviceResolver: ResolveFn<DeviceModel | undefined> =
  (route: ActivatedRouteSnapshot) => {
    return inject(DeviceService).getBySlug(route.paramMap.get('slug')!);
  };
