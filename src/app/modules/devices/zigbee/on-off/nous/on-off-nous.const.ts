import { DeviceCommands, zigbeeInfoCommandFilters, zigbeeLinkerOnOffInfoCommandFilters } from '@devices';
import { OnOffNousGlobalCommandAction, OnOffNousGlobalCommandInfo } from './on-off-nous.type';

export const zigbeeLinkerOnOffNousInfoCommandFilters: DeviceCommands<OnOffNousGlobalCommandInfo> = {
  ...zigbeeInfoCommandFilters,
  ...zigbeeLinkerOnOffInfoCommandFilters,
  indicator: { logicalId: 'indicator_mode' },
};

export const zigbeeLinkerOnOffNousActionCommandFilters: DeviceCommands<OnOffNousGlobalCommandAction> = {
  on: { generic_type: 'ENERGY_ON' },
  off: { generic_type: 'ENERGY_OFF' },
  toggle: { logicalId: 'state___TOGGLE' },
  indicator: { logicalId: 'indicator_mode___select' },
};

