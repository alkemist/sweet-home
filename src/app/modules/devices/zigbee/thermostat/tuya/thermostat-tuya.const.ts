import {DeviceCommands} from '@devices';
import {ThermostatCommandInfo} from '../thermostat.type';

export const zigbeeOfficialThermostatTuyaInfoCommandFilters: Partial<DeviceCommands<ThermostatCommandInfo>> = {
  battery_low: {logicalId: 'battery_low'},
};
