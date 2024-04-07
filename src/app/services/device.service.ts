import { inject, Injectable, WritableSignal } from '@angular/core';
import {
  DeviceBackInterface,
  DeviceModel,
  JeedomCommandResultInterface,
  JeedomDeviceModel,
  JeedomRoomModel
} from '@models';
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
  DeviceResetAction,
  DeviceState,
  DeviceUpdateAction
} from '@stores';
import { Observe } from '@alkemist/ngx-state-manager';

@Injectable({
  providedIn: 'root'
})
export class DeviceService extends DataStoreStateService<DeviceBackInterface> {
  @Observe(DeviceState, DeviceState.lastUpdated)
  protected _lastUpdated!: WritableSignal<Date | null>;

  /*@Observe(DeviceState, DeviceState.items)
  protected _items!: WritableSignal<DeviceBackInterface[]>;


  @Observe(DeviceState, DeviceState.filteredItems)
  protected _filteredItems!: WritableSignal<DeviceBackInterface[]>;

  @Observe(DeviceState, DeviceState.lastFiltered)
  protected _lastFiltered!: WritableSignal<Date | null>;

  @Observe(DeviceState, DeviceState.item)
  protected _item!: WritableSignal<DeviceBackInterface | null>;*/

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
      DeviceDeleteAction,
      DeviceResetAction
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
    const response = await this.selectItem(slug);
    return response.item;
  }

  async exist(device: DeviceModel, id?: string) {
    const data = id
      ? await this.existUpdateItem(id, device.toUniqueFields())
      : await this.existAddItem(device.toUniqueFields());

    return data.response;
  }

  updateComponents(components: BaseDeviceComponent[]) {
    const commandIds = components.reduce((result, current) => {
      return result.concat(current.actionInfoIds.getValues());
    }, [] as number[])

    return this.jeedomService.execInfoCommands(commandIds).then((values) => {
      if (values) {
        components.forEach((component) => {
          component.updateGlobalInfoCommandValues(values);
        })
      }
    })
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

export const deviceGetResolver: ResolveFn<void | null> =
  async (route: ActivatedRouteSnapshot) => {
    return inject(DeviceService).get(route.paramMap.get('slug')!);
  };

export const deviceAddResolver: ResolveFn<void | null> =
  async (route: ActivatedRouteSnapshot) => {
    return inject(DeviceService).reset();
  };
