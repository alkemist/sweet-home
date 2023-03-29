import { Commands } from '../../device-configurations.const';
import { ThermostatOtherCommandInfo } from '../thermostat.type';

export const zigbeeOfficialThermostatMoesInfoCommandFilters: Commands<ThermostatOtherCommandInfo> = {
  thermostat: { generic_type: 'THERMOSTAT_SETPOINT', name: 'Consigne' },
};
