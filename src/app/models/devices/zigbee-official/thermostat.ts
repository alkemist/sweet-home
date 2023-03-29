import { Commands } from '../../device-configurations.const';
import { ThermostatCommandAction, ThermostatCommandInfo } from '../thermostat.type';

export const zigbeeOfficialThermostatInfoCommandFilters: Commands<ThermostatCommandInfo> = {
  room: { generic_type: 'THERMOSTAT_TEMPERATURE' },
};

export const zigbeeOfficialThermostatActionCommandFilters: Commands<ThermostatCommandAction> = {
  thermostat: { generic_type: 'THERMOSTAT_SET_SETPOINT' },
};
