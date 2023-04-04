import { DeviceCommands } from '../device-configurations.const';
import { OnOffCommandAction, OnOffCommandInfo } from './on-off.type';


export const zigbeeOfficialOnOffInfoCommandFilters: DeviceCommands<OnOffCommandInfo> = {
  state: { generic_type: 'LIGHT_STATE' },
};

export const zigbeeOfficialOnOffActionCommandFilters: DeviceCommands<OnOffCommandAction> = {
  on: { generic_type: 'LIGHT_ON' },
  off: { generic_type: 'LIGHT_OFF' },
  toggle: { generic_type: 'LIGHT_TOGGLE' },
};
