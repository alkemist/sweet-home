import { DeviceCommands, OnOffCommandAction } from '@devices';

export const zigbeeLinkerOnOffLidlActionCommandFilters: DeviceCommands<OnOffCommandAction> = {
  on: { generic_type: 'ENERGY_ON' },
  off: { generic_type: 'ENERGY_OFF' },
  toggle: { logicalId: 'state___TOGGLE' },
};
