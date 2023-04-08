import { DeviceCommands } from '../../../device-configurations.const';
import { ThermostatCommandInfo } from '../thermostat.type';

export const zigbeeOfficialThermostatMoesInfoCommandFilters: Partial<DeviceCommands<ThermostatCommandInfo>> = {
  thermostat: { generic_type: 'THERMOSTAT_SETPOINT', name: 'Consigne' },
};
