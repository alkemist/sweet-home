import { DeviceModel, DeviceStoredInterface } from '@models';
import { inject, Injectable } from '@angular/core';
import { AddDevice, DeviceState, FillDevices, InvalideDevices, RemoveDevice, UpdateDevice } from '@stores';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { JeedomService } from './jeedom.service';
import { LoggerService } from './logger.service';
import { DataStoreService } from './data-store.service';
import { MessageService } from 'primeng/api';
import { JeedomDeviceModel } from '../models/jeedom-device.model';
import { JeedomRoomModel } from '../models/jeedom-room.model';
import { BaseDeviceComponent } from '../modules/devices/base-device.component';
import { JeedomCommandResultInterface } from '../models/jeedom-command-result.interface';


@Injectable({
  providedIn: 'root'
})
export class DeviceService extends DataStoreService<DeviceStoredInterface, DeviceModel> {
  @Select(DeviceState.lastUpdated) override lastUpdated$?: Observable<Date>;
  // Données du store
  @Select(DeviceState.all) protected override all$?: Observable<DeviceStoredInterface[]>;

  constructor(messageService: MessageService,
              loggerService: LoggerService,
              store: Store,
              protected jeedomService: JeedomService) {
    super(messageService, loggerService, 'device', $localize`device`, DeviceModel, store,
      AddDevice, UpdateDevice, RemoveDevice, FillDevices, InvalideDevices);
  }

  availableDevices(): Promise<JeedomRoomModel[]> {
    return new Promise<JeedomRoomModel[]>(async resolve => {
      this.jeedomService.getFullObjects().then((rooms) => {
        resolve(
          rooms
            .filter((room) => room.eqLogics.length > 0
              && room.id === '1' || room.father_id === '1')
            .map((room) =>
              new JeedomRoomModel(
                room.id,
                room.name,
                room.eqLogics
                  .filter((device) => device.isEnable === '1')
                  .map((device) => {
                    return new JeedomDeviceModel(
                      device.id,
                      device.name,
                      device.eqType_name,
                      device.cmds,
                    );
                  })
              )
            )
        )
      });
    });
  }

  updateComponents(components: BaseDeviceComponent[]) {
    const commandIds = components.reduce((result, current) => {
      return result.concat(current.commandIds.getValues());
    }, [] as number[])

    console.log('-- Update commands', commandIds);

    this.jeedomService.execCommands(commandIds).then((values) => {
      console.log("-- Commands results", values);

      components.forEach((component) => {
        const commandIds = component.commandIds.getValues();
        const componentValues: Record<number, JeedomCommandResultInterface | null>
          = commandIds.reduce((result, current) => {
          result[current] = values[current] ?? null;
          return result;
        }, {} as Record<number, JeedomCommandResultInterface | null>)

        component.setCommandValues(componentValues);
      })
    })
  }
}

export const deviceResolver: ResolveFn<DeviceModel | undefined> =
  (route: ActivatedRouteSnapshot) => {
    return inject(DeviceService).getBySlug(route.paramMap.get('slug')!);
  };
