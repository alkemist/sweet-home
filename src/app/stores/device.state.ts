import { Injectable } from '@angular/core';
import { DeviceInterface, DocumentInterface } from '@models';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AddDevice, FillDevices, RemoveDevice, UpdateDevice } from '@app/stores/device.action';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';

export interface DeviceStateInterface {
  all: DeviceInterface[];
  lastUpdated: Date | null;
}

@Injectable()
@State<DeviceStateInterface>({
  name: 'devices',
  defaults: {
    all: [],
    lastUpdated: null,
  }
})
export class DeviceState {
  @Selector()
  static lastUpdated(state: DeviceStateInterface): Date | null {
    return state.lastUpdated;
  }

  @Selector()
  static all(state: DeviceStateInterface): DeviceInterface[] {
    return state.all;
  }

  @Action(FillDevices)
  fill({
         getState,
         patchState
       }: StateContext<DeviceStateInterface>, { payload }: FillDevices) {
    patchState({
      all: payload,
      lastUpdated: new Date()
    });
  }

  @Action(AddDevice)
  add({ setState }: StateContext<DeviceStateInterface>, { payload }: AddDevice) {
    setState(
      patch({
        all: append([ payload ])
      })
    );
  }

  @Action(RemoveDevice)
  remove({ setState }: StateContext<DeviceStateInterface>, { payload }: RemoveDevice) {
    setState(
      patch({
        all: removeItem<DocumentInterface>((item?: DocumentInterface) => item?.id === payload.id)
      })
    );
  }

  @Action(UpdateDevice)
  update({
           getState,
           patchState,
           setState
         }: StateContext<DeviceStateInterface>, { payload }: UpdateDevice) {
    setState(
      patch({
        all: updateItem<DocumentInterface>((item?: DocumentInterface) => item?.id === payload.id, payload)
      })
    );
  }
}
