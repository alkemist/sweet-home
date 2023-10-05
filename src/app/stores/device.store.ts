import { DeviceStoredInterface } from '@models';
import { AddDocument, FillDocuments, InvalideDocuments } from './document.action';
import { State, Action, Select, Observe, StateContext } from '@alkemist/ng-state-manager';
import { ValueRecord } from '@alkemist/smart-tools';
import { AddDevice, FillDevices, InvalideDevices, RemoveDevice, UpdateDevice } from './device.action';
import { environment } from '../../environments/environment';

export namespace Device {
  export interface StateInterface extends ValueRecord{
    all: DeviceStoredInterface[];
    lastUpdated: Date | null;
  }

  export class Fill {
    static readonly log: string = '[Device] Filled';
    constructor(public payload: DeviceStoredInterface[]) {}
  }

  export class Add {
    static readonly log: string = '[Device] Added';
    constructor(public payload: DeviceStoredInterface) {}
  }

  export class Update {
    static readonly log: string = '[Device] Added';
    constructor(public payload: DeviceStoredInterface) {}
  }

  export class Remove {
    static readonly log: string = '[Device] Removed';
    constructor(public payload: DeviceStoredInterface) {}
  }

  export class Invalide {
    static readonly log: string = '[Device] Invalided';
    constructor(public payload: void) {}
  }

  @State({
    class: StateModel,
    name: 'device',
    defaults: <StateInterface>{
      all: [],
      lastUpdated: null,
    },
    showLog: true,
    enableLocalStorage: true
  })
  export class StateModel {
    @Select('lastUpdated')
    static lastUpdated(state: StateInterface): Date | null {
      return state.lastUpdated;
    }

    @Select('all')
    static all(state: StateInterface): DeviceStoredInterface[] {
      return state.all;
    }

    @Action(Fill)
    fill({
           getState,
           patchState
         }: StateContext<StateInterface>, {payload}: FillDevices) {
      patchState({
        all: payload,
        lastUpdated: environment["APP_OFFLINE"] ? null : new Date()
      });
    }

    @Action(Invalide)
    invalidate({
                 patchState
               }: StateContext<StateInterface>, {}: FillDevices) {
      patchState({
        all: [],
        lastUpdated: null
      });
    }

    @Action(Add)
    add({setState}: StateContext<StateInterface>, {payload}: AddDevice) {
      /*setState(
        patch({
          all: append([payload])
        })
      );*/
    }

    @Action(Remove)
    remove({setState}: StateContext<StateInterface>, {payload}: RemoveDevice) {
      /*setState(
        patch({
          all: removeItem<DeviceStoredInterface>((item?: DeviceStoredInterface) => item?.id === payload.id)
        })
      );*/
    }

    @Action(Update)
    update({
             getState,
             patchState,
             setState
           }: StateContext<StateInterface>, {payload}: UpdateDevice) {
      /*setState(
        patch({
          all: updateItem<DeviceStoredInterface>((item?: DeviceStoredInterface) => item?.id === payload.id, payload)
        })
      );*/
    }
  }
}
