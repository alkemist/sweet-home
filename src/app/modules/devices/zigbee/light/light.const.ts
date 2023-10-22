import { DeviceCommands } from '@devices';
import { LightCommandAction, LightCommandInfo } from './light.type';

export const LightInfoCommandFilters: DeviceCommands<LightCommandInfo> = {
  state: {},
}

export const LightActionCommandFilters: DeviceCommands<LightCommandAction> = {
  on: { logicalId: '' },
  off: { logicalId: '' },
  toggle: { logicalId: '' },
}
