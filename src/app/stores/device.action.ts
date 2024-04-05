import { DeviceInterface } from '@models';

export class DeviceFillAction {
  static readonly log = "Fill Devices";

  constructor(public payload: DeviceInterface[]) {
  }
}

export class DeviceFilterAction {
  static readonly log = "Filter Devices";

  constructor(public payload: DeviceInterface[]) {
  }
}

export class DeviceGetAction {
  static readonly log = "Get Device";

  constructor(public payload: DeviceInterface) {
  }
}

export class DeviceAddAction {
  static readonly log = "Add Device";

  constructor(public payload: DeviceInterface) {
  }
}

export class DeviceUpdateAction {
  static readonly log = "Update Device";

  constructor(public payload: DeviceInterface) {
  }
}

export class DeviceDeleteAction {
  static readonly log = "Delete Device";

  constructor(public payload: DeviceInterface) {
  }
}
