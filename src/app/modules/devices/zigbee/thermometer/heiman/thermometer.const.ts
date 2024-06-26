import {
  DeviceCommands,
  zigbeeLinkerThermometerInfoCommandFilters,
  zigbeeOfficialThermometerInfoCommandFilters
} from '@devices';
import { ThermometerHeimanCommandInfo } from './thermometer.type';


export const zigbeeOfficialThermometerHeimanInfoCommandFilters: DeviceCommands<ThermometerHeimanCommandInfo> = {
  ...zigbeeOfficialThermometerInfoCommandFilters,
  co2: { logicalId: "co2" },
};

export const zigbeeLinkerThermometerInfoHeimanCommandFilters: DeviceCommands<ThermometerHeimanCommandInfo> = {
  ...zigbeeLinkerThermometerInfoCommandFilters,
  co2: { logicalId: "co2" },
};

export const ThermometerHeimanParams = [ 'co2' ];
