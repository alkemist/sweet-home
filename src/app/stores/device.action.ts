import { DeviceBackInterface } from '@models';

export class DeviceFillAction {
  static readonly key = "Fill";

  constructor(public payload: DeviceBackInterface[]) {
  }
}

export class DeviceFilterAction {
  static readonly key = "Filter";

  constructor(public payload: DeviceBackInterface[]) {
  }
}

export class DeviceGetAction {
  static readonly key = "Get";

  constructor(public payload: DeviceBackInterface) {
  }
}

export class DeviceAddAction {
  static readonly key = "Add";

  constructor(public payload: DeviceBackInterface) {
  }
}

export class DeviceUpdateAction {
  static readonly key = "Update";

  constructor(public payload: DeviceBackInterface) {
  }
}

export class DeviceDeleteAction {
  static readonly key = "Delete";

  constructor(public payload: DeviceBackInterface) {
  }
}

export class DeviceResetAction {
  static readonly key = "Reset";

  constructor(public payload: void) {
  }
}
