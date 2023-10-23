import { DeviceCommands, OnOffParamValue } from '@devices';
import { OnOffCommandAction, OnOffCommandInfo } from './on-off.type';
import { zigbeeInfoCommandFilters } from '../zigbee.const';


export const zigbeeOfficialOnOffInfoCommandFilters: DeviceCommands<OnOffCommandInfo> = {
  state: { generic_type: 'LIGHT_STATE' },
};

export const zigbeeOfficialOnOffActionCommandFilters: DeviceCommands<OnOffCommandAction> = {
  on: { generic_type: 'ENERGY_ON' },
  off: { generic_type: 'ENERGY_OFF' },
  toggle: { logicalId: 'state___TOGGLE' },
};

export const zigbeeLinkerOnOffInfoCommandFilters: DeviceCommands<OnOffCommandInfo> = {
  ...zigbeeInfoCommandFilters,
  state: { generic_type: 'ENERGY_STATE' },
};

export const OnOffParams: OnOffParamValue[] = [ 'security', 'icon' ];
