import { inject, Injectable, WritableSignal } from '@angular/core';
import { Observe } from '@alkemist/ngx-state-manager';
import { DeviceInterface, JeedomCommandResultInterface, JeedomDeviceModel, JeedomRoomModel } from '@models';
import { DataStoreStateService } from '@alkemist/ngx-data-store';
import { JeedomService } from './jeedom.service';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import BaseDeviceComponent from '@base-device-component';
import { environment } from '../../environments/environment';
import { UnknownCommandIdError } from '@errors';
import { JeedomHistoryInterface } from '../models/jeedom/jeedom-history.interface';
import { MessageService } from 'primeng/api';
import { LoggerService } from './logger.service';
import {
  DeviceAddAction,
  DeviceDeleteAction,
  DeviceFillAction,
  DeviceGetAction,
  DeviceState,
  DeviceUpdateAction
} from '@stores';

@Injectable({
  providedIn: 'root'
})
export class DeviceService extends DataStoreStateService<DeviceInterface> {
  @Observe(DeviceState, DeviceState.items)
  protected _items!: WritableSignal<DeviceInterface[]>;

  @Observe(DeviceState, DeviceState.item)
  protected _item!: WritableSignal<DeviceInterface | null>;

  @Observe(DeviceState, DeviceState.lastUpdated)
  protected _lastUpdated!: WritableSignal<Date | null>;

  constructor(
    private jeedomService: JeedomService,
    private messageService: MessageService,
    private loggerService: LoggerService,
  ) {
    super(
      'device',
      DeviceFillAction,
      DeviceFillAction,
      DeviceGetAction,
      DeviceAddAction,
      DeviceUpdateAction,
      DeviceDeleteAction
    );
  }

  override storeIsOutdated(): boolean {
    if (environment["APP_OFFLINE"]) {
      return false;
    }
    return super.storeIsOutdated();
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

  async getBySlug(slug: string) {
    const response = await this.searchItem({ slug });
    return response.item;
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
    if (environment["APP_OFFLINE"]) {
      return Promise.resolve(null);
    }

    if (!commandId) {
      this.loggerService.error(
        new UnknownCommandIdError(commandName)
      );
      return Promise.resolve(null);
    }

    return this.jeedomService.execActionCommand(commandId, commandValue)
  }

  execHistory(commandId: number, commandName: string, dateStart: string, dateEnd: string): Promise<JeedomHistoryInterface[]> {
    if (environment["APP_OFFLINE"]) {
      return Promise.resolve([]);
    }

    if (!commandId) {
      this.loggerService.error(
        new UnknownCommandIdError(commandName)
      );
      return Promise.resolve([]);
    }

    return this.jeedomService.execHistoryCommand(commandId, dateStart, dateEnd)
  }
}

export const deviceResolver: ResolveFn<DeviceInterface | null> =
  (route: ActivatedRouteSnapshot) => {
    return inject(DeviceService).getBySlug(route.paramMap.get('slug')!);
  };
