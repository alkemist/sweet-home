import { ZigbeeBatteryExtendCommandInfo, ZigbeeBatteryGlobalCommandInfo } from '../zigbee.type';

export type BrightnessCommandInfo = 'brightness' | 'brightness_lux';

export type BrightnessExtendCommandInfo = BrightnessCommandInfo & ZigbeeBatteryExtendCommandInfo;
export type BrightnessGlobalCommandInfo = BrightnessCommandInfo | ZigbeeBatteryGlobalCommandInfo;

export type BrightnessParamValue = 'brightness_lux_light';