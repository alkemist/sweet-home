import { DeviceBackInterface } from '@models';

export class DeviceFillAction {
  static readonly log = "Fill";

  constructor(public payload: DeviceBackInterface[]) {
  }
}

export class DeviceFilterAction {
  static readonly log = "Filter";

  constructor(public payload: DeviceBackInterface[]) {
  }
}

export class DeviceGetAction {
  static readonly log = "Get";

  constructor(public payload: DeviceBackInterface) {
  }
}

export class DeviceAddAction {
  static readonly log = "Add";

  constructor(public payload: DeviceBackInterface) {
  }
}

export class DeviceUpdateAction {
  static readonly log = "Update";

  constructor(public payload: DeviceBackInterface) {
  }
}

export class DeviceDeleteAction {
  static readonly log = "Delete";

  constructor(public payload: DeviceBackInterface) {
  }
}

export class DeviceResetAction {
  static readonly log = "Reset";

  constructor(public payload: void) {
  }
}
