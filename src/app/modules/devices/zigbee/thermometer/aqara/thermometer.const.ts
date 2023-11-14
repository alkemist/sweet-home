import {
  DeviceCommands,
  zigbeeLinkerThermometerInfoCommandFilters,
  zigbeeOfficialThermometerInfoCommandFilters
} from '@devices';
import { ThermometerAqaraCommandInfo } from './thermometer.type';


export const zigbeeOfficialThermometerAqaraInfoCommandFilters: DeviceCommands<ThermometerAqaraCommandInfo> = {
  ...zigbeeOfficialThermometerInfoCommandFilters,
  pression: { generic_type: 'PRESSURE' },
};

export const zigbeeLinkerThermometerInfoAqaraCommandFilters: DeviceCommands<ThermometerAqaraCommandInfo> = {
  ...zigbeeLinkerThermometerInfoCommandFilters,
  pression: { generic_type: 'PRESSURE' },
};

export const ThermometerAqaraParams = [ 'pression' ];
