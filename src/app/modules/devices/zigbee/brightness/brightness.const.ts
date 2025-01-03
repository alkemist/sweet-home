import { BrightnessParamValue, DeviceCommands } from '@devices';
import { BrightnessCommandInfo } from './brightness.type';
import { zigbeeBatteryInfoCommandFilters } from '../zigbee.const';


export const zigbeeOfficialBrightnessInfoCommandFilters: DeviceCommands<BrightnessCommandInfo> = {
  brightness: { generic_type: 'BRIGHTNESS', unite: "" },
  brightness_lux: { generic_type: 'BRIGHTNESS', unite: "lx" },
};

export const zigbeeLinkerBrightnessInfoCommandFilters: DeviceCommands<BrightnessCommandInfo> = {
  ...zigbeeBatteryInfoCommandFilters,
  brightness: { generic_type: 'BRIGHTNESS', unite: "" },
  brightness_lux: { generic_type: 'BRIGHTNESS', unite: "lx" },
};

export const BrightnessParams: string[] = [ 'brightness_lux_light' ];