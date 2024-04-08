import { Action, Select, State, StateContext } from '@alkemist/ngx-state-manager';
import {
  DeviceAddAction,
  DeviceDeleteAction,
  DeviceFillAction,
  DeviceGetAction,
  DeviceResetAction,
  DeviceUpdateAction
} from './device.action';
import { DocumentInterface, DocumentState, DocumentStateInterface } from '@alkemist/ngx-data-store';
import { DeviceBackInterface } from '@models';
import { environment } from '../../environments/environment';

interface DeviceStateInterface extends DocumentStateInterface<DeviceBackInterface> {
}

@State({
  name: 'Device',
  class: DeviceState,
  defaults: <DeviceStateInterface>{
    items: [] as DeviceBackInterface[],
    lastUpdated: null,
    filteredItems: [] as DeviceBackInterface[],
    lastFiltered: null,
    item: null,
  },
  showLog: environment['APP_DEBUG'],
  enableLocalStorage: true,
  determineArrayIndexFn: () => 'id',
})
export class DeviceState extends DocumentState<DeviceBackInterface> {
  @Select('lastUpdated')
  static override lastUpdated<T extends DocumentInterface>(state: DocumentStateInterface<T>) {
    return DocumentState.lastUpdated<T>(state);
  }

  @Select('items')
  static override items<T extends DocumentInterface>(state: DocumentStateInterface<T>): T[] {
    return DocumentState.items(state);
  }

  @Select('lastFiltered')
  static override lastFiltered<T extends DocumentInterface>(state: DocumentStateInterface<T>) {
    return DocumentState.lastFiltered<T>(state);
  }

  @Select('filteredItems')
  static override filteredItems<T extends DocumentInterface>(state: DocumentStateInterface<T>): T[] {
    return DocumentState.filteredItems(state);
  }

  @Select('item')
  static override item<T extends DocumentInterface>(state: DocumentStateInterface<T>): T | null {
    return DocumentState.item(state);
  }

  @Action(DeviceFillAction)
  override fill(context: StateContext<DeviceStateInterface>, payload: DeviceBackInterface[]) {
    super.fill(context, payload);
  }

  @Action(DeviceGetAction)
  override get(context: StateContext<DeviceStateInterface>, payload: DeviceBackInterface) {
    super.get(context, payload);
  }

  @Action(DeviceAddAction)
  override add(context: StateContext<DeviceStateInterface>, payload: DeviceBackInterface) {
    super.add(context, payload);
  }

  @Action(DeviceUpdateAction)
  override update(context: StateContext<DeviceStateInterface>, payload: DeviceBackInterface) {
    super.update(context, payload);
  }

  @Action(DeviceDeleteAction)
  override remove(context: StateContext<DeviceStateInterface>, payload: DeviceBackInterface) {
    super.remove(context, payload);
  }

  @Action(DeviceResetAction)
  override reset(context: StateContext<DeviceStateInterface>, payload: void) {
    super.reset(context, payload);
  }
}
