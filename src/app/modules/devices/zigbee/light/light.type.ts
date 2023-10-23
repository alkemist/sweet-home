import { ZigbeeCommandInfo } from '../zigbee-component.directive';

export type LightCommandInfo = 'state' | 'brightness' | 'color';
export type LightCommandAction = 'on' | 'off' | 'toggle' | 'brightness' | 'color';
export type LightParamValue = 'colorMin' | 'colorMax';

export type LightExtendCommandInfo = LightCommandInfo & ZigbeeCommandInfo;
export type LightGlobalCommandInfo = LightCommandInfo | ZigbeeCommandInfo;
