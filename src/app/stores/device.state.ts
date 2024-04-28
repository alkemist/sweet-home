import { Action, Select, State, StateContext } from '@alkemist/ngx-state-manager';
import {
  DeviceAddAction,
  DeviceDeleteAction,
  DeviceFillAction,
  DeviceGetAction,
  DeviceResetAction,
  DeviceUpdateAction
} from './device.action';
import { DocumentFrontInterface, DocumentState, DocumentStateInterface } from '@alkemist/ngx-data-store';
import { DeviceFrontInterface } from '@models';
import { environment } from '../../environments/environment';

interface DeviceStateInterface extends DocumentStateInterface<DeviceFrontInterface> {
}

@State({
  name: 'Device',
  class: DeviceState,
  defaults: <DeviceStateInterface>{
    userItems: [] as DeviceFrontInterface[],
    lastUpdatedUserItems: null,
    item: null,
  },
  showLog: environment['APP_DEBUG'],
  enableLocalStorage: true,
  determineArrayIndexFn: () => 'id',
})
export class DeviceState extends DocumentState<DeviceFrontInterface> {
  @Select('lastUpdatedUserItems')
  static lastUpdated<T extends DocumentFrontInterface>(state: DocumentStateInterface<T>) {
    return DocumentState.lastUpdatedUserItems<T>(state);
  }

  @Select('userItems')
  static items<T extends DocumentFrontInterface>(state: DocumentStateInterface<T>): T[] {
    return DocumentState.userItems(state);
  }

  @Select('item')
  static override item<T extends DocumentFrontInterface>(state: DocumentStateInterface<T>): T | null {
    return DocumentState.item(state);
    
  }

  @Action(DeviceFillAction)
  fill(context: StateContext<DeviceStateInterface>, payload: DeviceFrontInterface[]) {
    super.fillUserItems(context, payload);
  }

  @Action(DeviceGetAction)
  override get(context: StateContext<DeviceStateInterface>, payload: DeviceFrontInterface) {
    super.get(context, payload);
  }

  @Action(DeviceAddAction)
  override add(context: StateContext<DeviceStateInterface>, payload: DeviceFrontInterface) {
    super.add(context, payload);
  }

  @Action(DeviceUpdateAction)
  override update(context: StateContext<DeviceStateInterface>, payload: DeviceFrontInterface) {
    super.update(context, payload);
  }

  @Action(DeviceDeleteAction)
  override remove(context: StateContext<DeviceStateInterface>, payload: DeviceFrontInterface) {
    super.remove(context, payload);
  }

  @Action(DeviceResetAction)
  override reset(context: StateContext<DeviceStateInterface>, payload: void) {
    super.reset(context, payload);
  }
}
