import { ZigbeeCommandInfo } from '../zigbee-component.directive';

export type LightCommandValueInfo = 'brightness' | 'temperature' | 'color';
export type LightCommandInfo = 'state' | LightCommandValueInfo;
export type LightCommandAction = 'on' | 'off' | 'toggle' | 'brightness' | 'temperature' | 'color';
export type LightParamValue = '';

export type LightExtendCommandInfo = LightCommandInfo & ZigbeeCommandInfo;
export type LightGlobalCommandInfo = LightCommandInfo | ZigbeeCommandInfo;
