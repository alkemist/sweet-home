import { DeviceCommands, ThermostatCommandAction, ThermostatCommandInfo } from '@devices';
import { zigbeeBatteryInfoCommandFilters } from '../zigbee.const';

export const zigbeeOfficialThermostatInfoCommandFilters: Partial<DeviceCommands<ThermostatCommandInfo>> = {
  room: { generic_type: 'THERMOSTAT_TEMPERATURE' },
};

export const zigbeeOfficialThermostatActionCommandFilters: Partial<DeviceCommands<ThermostatCommandAction>> = {
  thermostat: { generic_type: 'THERMOSTAT_SET_SETPOINT' },
};

export const zigbeeLinkerThermostatInfoCommandFilters: DeviceCommands<ThermostatCommandInfo> = {
  room: { logicalId: 'local_temperature' },
  thermostat: { generic_type: 'THERMOSTAT_SETPOINT' },
  ...zigbeeBatteryInfoCommandFilters,
};

export const zigbeeLinkerThermostatActionCommandFilters: DeviceCommands<ThermostatCommandAction> = {
  thermostat: { generic_type: 'THERMOSTAT_SET_SETPOINT' },
};
