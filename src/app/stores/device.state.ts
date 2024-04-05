import { Action, Select, State, StateContext } from '@alkemist/ngx-state-manager';
import {
  DeviceAddAction,
  DeviceDeleteAction,
  DeviceFillAction,
  DeviceGetAction,
  DeviceUpdateAction
} from './device.action';
import { DocumentInterface, DocumentState, DocumentStateInterface } from '@alkemist/ngx-data-store';
import { DeviceInterface } from '@models';

interface DeviceStateInterface extends DocumentStateInterface<DeviceInterface> {
}

@State({
  name: 'Device',
  class: DeviceState,
  defaults: <DeviceStateInterface>{
    lastUpdated: null,
    items: [] as DeviceInterface[],
    item: null,
  },
  showLog: true,
  enableLocalStorage: true,
  determineArrayIndexFn: () => 'id',
})
export class DeviceState extends DocumentState<DeviceInterface> {
  @Select('lastUpdated')
  static override lastUpdated<T extends DocumentInterface>(state: DocumentStateInterface<T>) {
    return DocumentState.lastUpdated<T>(state);
  }

  @Select('items')
  static override items<T extends DocumentInterface>(state: DocumentStateInterface<T>): T[] {
    return DocumentState.items(state);
  }

  @Select('item')
  static override item<T extends DocumentInterface>(state: DocumentStateInterface<T>): T | null {
    return DocumentState.item(state);
  }

  @Action(DeviceFillAction)
  override fill(context: StateContext<DeviceStateInterface>, payload: DeviceInterface[]) {
    super.fill(context, payload);
  }

  @Action(DeviceGetAction)
  override get(context: StateContext<DeviceStateInterface>, payload: DeviceInterface) {
    super.get(context, payload);
  }

  @Action(DeviceAddAction)
  override add(context: StateContext<DeviceStateInterface>, payload: DeviceInterface) {
    super.add(context, payload);
  }

  @Action(DeviceUpdateAction)
  override update(context: StateContext<DeviceStateInterface>, payload: DeviceInterface) {
    super.update(context, payload);
  }

  @Action(DeviceDeleteAction)
  override remove(context: StateContext<DeviceStateInterface>, payload: DeviceInterface) {
    super.remove(context, payload);
  }
}
