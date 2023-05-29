import {Injectable} from "@angular/core";
import {DeviceStoredInterface} from "@models";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {append, patch, removeItem, updateItem} from "@ngxs/store/operators";
import {AddDevice, FillDevices, InvalideDevices, RemoveDevice, UpdateDevice} from "./device.action";
import {environment} from "../../environments/environment";

export interface DeviceStateInterface {
  all: DeviceStoredInterface[];
  lastUpdated: Date | null;
}

@Injectable()
@State<DeviceStateInterface>({
  name: "devices",
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
  static all(state: DeviceStateInterface): DeviceStoredInterface[] {
    return state.all;
  }

  @Action(FillDevices)
  fill({
         getState,
         patchState
       }: StateContext<DeviceStateInterface>, {payload}: FillDevices) {
    patchState({
      all: payload,
      lastUpdated: environment["APP_OFFLINE"] ? null : new Date()
    });
  }

  @Action(InvalideDevices)
  invalidate({
               patchState
             }: StateContext<DeviceStateInterface>, {}: FillDevices) {
    patchState({
      all: [],
      lastUpdated: null
    });
  }

  @Action(AddDevice)
  add({setState}: StateContext<DeviceStateInterface>, {payload}: AddDevice) {
    setState(
      patch({
        all: append([payload])
      })
    );
  }

  @Action(RemoveDevice)
  remove({setState}: StateContext<DeviceStateInterface>, {payload}: RemoveDevice) {
    setState(
      patch({
        all: removeItem<DeviceStoredInterface>((item?: DeviceStoredInterface) => item?.id === payload.id)
      })
    );
  }

  @Action(UpdateDevice)
  update({
           getState,
           patchState,
           setState
         }: StateContext<DeviceStateInterface>, {payload}: UpdateDevice) {
    setState(
      patch({
        all: updateItem<DeviceStoredInterface>((item?: DeviceStoredInterface) => item?.id === payload.id, payload)
      })
    );
  }
}
