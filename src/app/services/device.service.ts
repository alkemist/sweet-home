import {
  DeviceModel,
  DeviceStoredInterface,
  JeedomCommandResultInterface,
  JeedomDeviceModel,
  JeedomRoomModel
} from '@models';
import { inject, Injectable } from '@angular/core';
import { AddDevice, DeviceState, FillDevices, InvalideDevices, RemoveDevice, UpdateDevice } from '@stores';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { JeedomService } from './jeedom.service';
import { LoggerService } from './logger.service';
import { DatastoreService } from './datastore.service';
import { MessageService } from 'primeng/api';
import { UnknownCommandIdError } from '@errors';
import { JsonService } from './json.service';
import BaseDeviceComponent from "@base-device-component";


@Injectable({
  providedIn: 'root'
})
export class DeviceService extends DatastoreService<DeviceStoredInterface, DeviceModel> {
  @Select(DeviceState.lastUpdated) override lastUpdated$?: Observable<Date>;
  //@Observe(Device.StateModel, Device.StateModel.lastUpdated)
  //override signalLastUpdated = signal<Date | null>(null);
  // Données du store
  @Select(DeviceState.all) protected override all$?: Observable<DeviceStoredInterface[]>;
  //@Observe(Device.StateModel, Device.StateModel.all)
  //protected override signallAll = signal<DeviceStoredInterface[]>([]);

  constructor(messageService: MessageService,
              protected override loggerService: LoggerService,
              jsonService: JsonService,
              store: Store,
              //stateManager: StateManager,
              protected jeedomService: JeedomService) {
    super(messageService, loggerService, jsonService, 'device', $localize`device`, DeviceModel, store,
      //stateManager,
      AddDevice, UpdateDevice, RemoveDevice, FillDevices, InvalideDevices,
      //Device.Add, Device.Update, Device.Remove, Device.Fill, Device.Invalide
    );
  }

  availableDevices(): Promise<JeedomRoomModel[]> {
    return new Promise<JeedomRoomModel[]>(async resolve => {
      this.jeedomService.getFullObjects().then((rooms) => {
        if (rooms) {
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
                        device
                      );
                    })
                )
              )
          )
        } else {
          resolve([])
        }
      });
    });
  }

  updateComponents(components: BaseDeviceComponent[]): Promise<boolean> {
    const commandIds = components.reduce((result, current) => {
      return result.concat(current.actionInfoIds.getValues());
    }, [] as number[])

    // console.log('-- Update commands', commandIds);

    return new Promise<boolean>((resolve) => {
      this.jeedomService.execInfoCommands(commandIds).then((values) => {
        //console.log("-- Commands results", values);

        if (values) {
          components.forEach((component) => {
            component.updateGlobalInfoCommandValues(values);
          })
          resolve(true);
        } else {
          console.info('NO VALUES');
          resolve(false);
        }
      })
        .catch(_ => {
          return resolve(false);
        })
    });
  }

  execCommand(commandId: number, commandName: string, commandValue?: unknown): Promise<JeedomCommandResultInterface | null> {
    if (!commandId) {
      this.loggerService.error(
        new UnknownCommandIdError(commandName)
      );
      return Promise.resolve(null);
    }

    return this.jeedomService.execActionCommand(commandId, commandValue)
  }
}

export const deviceResolver: ResolveFn<DeviceModel | undefined> =
  (route: ActivatedRouteSnapshot) => {
    return inject(DeviceService).getBySlug(route.paramMap.get('slug')!);
  };
