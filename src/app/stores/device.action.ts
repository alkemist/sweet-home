import { DeviceBackInterface } from '@models';
import { StateAction } from '@alkemist/ngx-state-manager';

export class DeviceFillAction extends StateAction<DeviceBackInterface[]> {
  static override readonly key = "Fill";

  constructor(public payload: DeviceBackInterface[]) {
    super();
  }
}

export class DeviceFilterAction extends StateAction<DeviceBackInterface[]> {
  static override readonly key = "Filter";

  constructor(public payload: DeviceBackInterface[]) {
    super();
  }
}

export class DeviceGetAction extends StateAction<DeviceBackInterface> {
  static override readonly key = "Get";

  constructor(public payload: DeviceBackInterface) {
    super();
  }
}

export class DeviceAddAction extends StateAction<DeviceBackInterface> {
  static override readonly key = "Add";

  constructor(public payload: DeviceBackInterface) {
    super();
  }
}

export class DeviceUpdateAction extends StateAction<DeviceBackInterface> {
  static override readonly key = "Update";

  constructor(public payload: DeviceBackInterface) {
    super();
  }
}

export class DeviceDeleteAction extends StateAction<DeviceBackInterface> {
  static override readonly key = "Delete";

  constructor(public payload: DeviceBackInterface) {
    super();
  }
}

export class DeviceResetAction extends StateAction<void> {
  static override readonly key = "Reset";

  constructor(public payload: void) {
    super();
  }
}
