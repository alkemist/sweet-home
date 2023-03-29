import { Commands } from '../../device-configurations.const';
import { ThermostatOtherCommandInfo } from '../thermostat.type';

export const zigbeeOfficialThermostatAqaraInfoCommandFilters: Commands<ThermostatOtherCommandInfo> = {
  thermostat: { generic_type: 'THERMOSTAT_SETPOINT', name: 'Consigne 1' },
};
