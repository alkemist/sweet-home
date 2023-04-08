import { DeviceCommands } from '../../device-configurations.const';
import { ThermometerCommandInfo } from './thermometer.type';
import { zigbeeBatteryInfoCommandFilters } from '../zigbee.const';


export const zigbeeOfficialThermometerInfoCommandFilters: DeviceCommands<ThermometerCommandInfo> = {
  temperature: { generic_type: 'TEMPERATURE' },
  humidity: { generic_type: 'HUMIDITY' },
  pression: { generic_type: 'PRESSURE' },
};

export const zigbeeLinkerThermometerInfoCommandFilters: DeviceCommands<ThermometerCommandInfo> = {
  ...zigbeeBatteryInfoCommandFilters,
  temperature: { generic_type: 'TEMPERATURE' },
  humidity: { generic_type: 'HUMIDITY' },
  pression: { generic_type: 'PRESSURE' },
};
