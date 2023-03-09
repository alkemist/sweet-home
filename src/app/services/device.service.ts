import { Injectable } from '@angular/core';
import { LoggerService } from '@app/services/logger.service';
import { DeviceInterface } from '@app/models/device.interface';
import { JeedomService } from '@app/services/jeedom.service';
import { DeviceModel } from '@models';
import { DataStoreService } from '@app/services/data-store.service';
import { AddDevice, DeviceState, FillDevices, RemoveDevice, UpdateDevice } from '@stores';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DeviceService extends DataStoreService<DeviceInterface, DeviceModel> {
  @Select(DeviceState.lastUpdated) override lastUpdated$?: Observable<Date>;
  // Données du store
  @Select(DeviceState.all) protected override all$?: Observable<DeviceInterface[]>;

  constructor(logger: LoggerService,
              store: Store,
              jeedomService: JeedomService) {
    super(logger, 'device', DeviceModel, store,
      AddDevice, UpdateDevice, RemoveDevice, FillDevices);
  }
}
