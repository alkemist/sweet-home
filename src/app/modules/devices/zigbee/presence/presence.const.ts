import { DeviceCommands } from '@devices';
import { PresenceCommandInfo } from './presence.type';
import { zigbeeInfoCommandFilters } from '../zigbee.const';

export const zigbeeLinkerPresenceInfoCommandFilters: DeviceCommands<PresenceCommandInfo> = {
  ...zigbeeInfoCommandFilters,
  state: { generic_type: 'PRESENCE' },
  brightness: { logicalId: 'illumination' },
};
