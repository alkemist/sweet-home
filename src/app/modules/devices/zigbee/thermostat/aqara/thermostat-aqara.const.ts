import { DeviceCommands } from '../../../device-configurations.const';
import { ThermostatCommandInfo } from '../thermostat.type';

export const zigbeeOfficialThermostatAqaraInfoCommandFilters: Partial<DeviceCommands<ThermostatCommandInfo>> = {
  thermostat: { generic_type: 'THERMOSTAT_SETPOINT', name: 'Consigne 1' },
};
