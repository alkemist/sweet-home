import { DeviceCommands, OnOffCommandAction } from '@devices';

export const zigbeeLinkerOnOffSchneiderActionCommandFilters: DeviceCommands<OnOffCommandAction> = {
  on: { generic_type: 'ENERGY_ON', logicalId: "state___ON" },
  off: { generic_type: 'ENERGY_OFF', logicalId: "state___OFF" },
  toggle: { logicalId: 'state___TOGGLE' },
};
