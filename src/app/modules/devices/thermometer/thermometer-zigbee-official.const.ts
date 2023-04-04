import { DeviceCommands } from '../device-configurations.const';
import { ThermometerCommandInfo } from './thermometer.type';


export const zigbeeOfficialThermometerInfoCommandFilters: DeviceCommands<ThermometerCommandInfo> = {
  temperature: { generic_type: 'TEMPERATURE' },
  humidity: { generic_type: 'HUMIDITY' },
  pression: { generic_type: 'PRESSURE' },
};
