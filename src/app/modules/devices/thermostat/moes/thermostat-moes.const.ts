import { DeviceCommands } from '../../device-configurations.const';
import { ThermostatOtherCommandInfo } from '../thermostat-zigbee-official.type';

export const zigbeeOfficialThermostatMoesInfoCommandFilters: DeviceCommands<ThermostatOtherCommandInfo> = {
  thermostat: { generic_type: 'THERMOSTAT_SETPOINT', name: 'Consigne' },
};
