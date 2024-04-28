import { DeviceBackInterface } from '@models';
import { StateAction } from '@alkemist/ngx-state-manager';

export class DeviceFillAction extends StateAction<DeviceBackInterface[]> {
  static override readonly key = "Device_Fill";

  constructor(public payload: DeviceBackInterface[]) {
    super();
  }
}

export class DeviceGetAction extends StateAction<DeviceBackInterface> {
  static override readonly key = "Device_Get";

  constructor(public payload: DeviceBackInterface) {
    super();
  }
}

export class DeviceAddAction extends StateAction<DeviceBackInterface> {
  static override readonly key = "Device_Add";

  constructor(public payload: DeviceBackInterface) {
    super();
  }
}

export class DeviceUpdateAction extends StateAction<DeviceBackInterface> {
  static override readonly key = "Device_Update";

  constructor(public payload: DeviceBackInterface) {
    super();
  }
}

export class DeviceDeleteAction extends StateAction<DeviceBackInterface> {
  static override readonly key = "Device_Delete";

  constructor(public payload: DeviceBackInterface) {
    super();
  }
}

export class DeviceResetAction extends StateAction<void> {
  static override readonly key = "Device_Reset";

  constructor(public payload: void) {
    super();
  }
}
