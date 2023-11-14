import { DeviceCommands } from '@devices';
import { ThermometerCommandInfo } from './thermometer.type';
import { zigbeeBatteryInfoCommandFilters } from '../zigbee.const';


export const zigbeeOfficialThermometerInfoCommandFilters: DeviceCommands<ThermometerCommandInfo> = {
  temperature: { generic_type: 'TEMPERATURE' },
  humidity: { generic_type: 'HUMIDITY' },
};

export const zigbeeLinkerThermometerInfoCommandFilters: DeviceCommands<ThermometerCommandInfo> = {
  ...zigbeeBatteryInfoCommandFilters,
  temperature: { generic_type: 'TEMPERATURE' },
  humidity: { generic_type: 'HUMIDITY' },
};
