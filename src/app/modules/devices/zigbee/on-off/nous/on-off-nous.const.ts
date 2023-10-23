import {
  DeviceCommands,
  zigbeeInfoCommandFilters,
  zigbeeLinkerOnOffInfoCommandFilters,
  zigbeeOfficialOnOffActionCommandFilters
} from '@devices';
import { OnOffNousGlobalCommandAction, OnOffNousGlobalCommandInfo } from './on-off-nous.type';

export const zigbeeLinkerOnOffNousInfoCommandFilters: DeviceCommands<OnOffNousGlobalCommandInfo> = {
  ...zigbeeInfoCommandFilters,
  ...zigbeeLinkerOnOffInfoCommandFilters,
  indicator: { logicalId: 'indicator_mode' },
};

export const zigbeeLinkerOnOffNousActionCommandFilters: DeviceCommands<OnOffNousGlobalCommandAction> = {
  ...zigbeeOfficialOnOffActionCommandFilters,
  indicator: { logicalId: 'indicator_mode___select' },
};

