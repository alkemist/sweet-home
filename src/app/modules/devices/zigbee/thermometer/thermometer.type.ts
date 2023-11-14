import { ZigbeeBatteryExtendCommandInfo, ZigbeeBatteryGlobalCommandInfo } from '../zigbee-battery-component.directive';

export type ThermometerCommandInfo = 'temperature' | 'humidity';

export type ThermometerExtendCommandInfo = ThermometerCommandInfo & ZigbeeBatteryExtendCommandInfo;
export type ThermometerGlobalCommandInfo = ThermometerCommandInfo | ZigbeeBatteryGlobalCommandInfo;

export type ThermometerParamValue = 'pression';
