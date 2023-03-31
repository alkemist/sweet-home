import { DeviceCommands } from '../device-configurations.const';
import { ThermostatCommandAction, ThermostatCommandInfo } from './thermostat-zigbee-official.type';

export const zigbeeOfficialThermostatInfoCommandFilters: DeviceCommands<ThermostatCommandInfo> = {
  room: { generic_type: 'THERMOSTAT_TEMPERATURE' },
};

export const zigbeeOfficialThermostatActionCommandFilters: DeviceCommands<ThermostatCommandAction> = {
  thermostat: { generic_type: 'THERMOSTAT_SET_SETPOINT' },
};
