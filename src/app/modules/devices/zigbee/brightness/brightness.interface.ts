import { ZigbeeBatteryCommandValues } from '../zigbee.interface';
import { BrightnessParamValue } from '@devices';

export interface BrightnessCommandValues extends ZigbeeBatteryCommandValues {
  brightness: number,
  brightness_lux: number,
}

export interface BrightnessParameterValues extends Record<BrightnessParamValue | string, string | number | boolean | null> {
  brightness_lux_light: number
}
