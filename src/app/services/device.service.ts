import { inject, Injectable, WritableSignal } from '@angular/core';
import {
  DeviceBackInterface,
  DeviceFrontInterface,
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
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService extends DataStoreStateService<DeviceFrontInterface, DeviceBackInterface> {
  @Observe(DeviceState, DeviceState.lastUpdated)
  protected _lastUpdatedUserItems!: WritableSignal<Date | null>;
  protected _lastUpdatedPublicItems: undefined;

  constructor(
    private jeedomService: JeedomService,
    private messageService: MessageService,
    private loggerService: LoggerService,
    userService: UserService,
  ) {
    super(
      userService,
      'device',
      DeviceState,
      null,
      DeviceState.items,
      null,
      DeviceFillAction,
      DeviceGetAction,
      DeviceAddAction,
      DeviceUpdateAction,
      DeviceDeleteAction,
      DeviceResetAction
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

  async exist(device: DeviceModel, id?: string) {
    const data = id
      ? await this.existUpdateItem(id, device.toUniqueFields())
      : await this.existAddItem(device.toUniqueFields());

    if (data.response) {
      this.messageService.add({
        severity: "error",
        detail: $localize`Device already exist.`
      });
    }

    return data.response;
  }

  async updateComponents(components: BaseDeviceComponent[]) {
    const commandIds = components.reduce((result, current) => {
      return result.concat(current.actionInfoIds.getValues());
    }, [] as number[])

    const values = await this.jeedomService.execPollingInfoCommands(commandIds);

    if (values) {
      components.forEach((component) => {
        component.updateGlobalInfoCommandValues(values);
      });
    }
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

  async update(id: string, device: DeviceModel) {
    await super.dispatchUpdate(id, device.toStore());
    this.messageService.add({
      severity: "success",
      detail: $localize`Device updated`
    });
  }

  async add(device: DeviceModel) {
    await super.dispatchAdd(device.toStore());
    this.messageService.add({
      severity: "success",
      detail: $localize`Device added`,
    });
  }

  async delete(device: DeviceModel) {
    await super.dispatchDelete(device.id);
    this.messageService.add({
      severity: "success",
      detail: $localize`Device deleted`
    });
  }
}

export const deviceGetResolver: ResolveFn<DeviceFrontInterface | null> =
  async (route: ActivatedRouteSnapshot) => {
    return inject(DeviceService).dispatchUserItem(route.paramMap.get('slug')!);
  };
