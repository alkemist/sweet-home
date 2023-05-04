import {DeviceCommands, OnOffCommandAction, OnOffCommandInfo, zigbeeInfoCommandFilters} from '@devices';


export const zigbeeLinkerOnOffMoesInfoCommandFilters: DeviceCommands<OnOffCommandInfo> = {
  ...zigbeeInfoCommandFilters,
  state: {generic_type: 'ENERGY_STATE', logicalId: "state_l1"},
};

export const zigbeeLinkerOnOffMoesActionCommandFilters: DeviceCommands<OnOffCommandAction> = {
  on: {generic_type: 'ENERGY_ON', logicalId: "state_l1___ON"},
  off: {generic_type: 'ENERGY_OFF', logicalId: "state_l1___OFF"},
  toggle: {logicalId: 'state_l1___TOGGLE'},
};
