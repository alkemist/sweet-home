import { DeviceBackInterface } from '@models';

export class DeviceFillAction {
  static readonly log = "Fill Devices";

  constructor(public payload: DeviceBackInterface[]) {
  }
}

export class DeviceFilterAction {
  static readonly log = "Filter Devices";

  constructor(public payload: DeviceBackInterface[]) {
  }
}

export class DeviceGetAction {
  static readonly log = "Get Device";

  constructor(public payload: DeviceBackInterface) {
  }
}

export class DeviceAddAction {
  static readonly log = "Add Device";

  constructor(public payload: DeviceBackInterface) {
  }
}

export class DeviceUpdateAction {
  static readonly log = "Update Device";

  constructor(public payload: DeviceBackInterface) {
  }
}

export class DeviceDeleteAction {
  static readonly log = "Delete Device";

  constructor(public payload: DeviceBackInterface) {
  }
}
