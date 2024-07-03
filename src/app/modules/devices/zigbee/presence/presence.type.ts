import { ZigbeeCommandInfo } from '../zigbee-component.directive';

export type PresenceCommandInfo = 'state' | 'brightness';
export type PresenceCommandAction = 'on' | 'off' | 'toggle'
export type PresenceParamValue = 'security' | 'icon';

export type PresenceExtendCommandInfo = PresenceCommandInfo & ZigbeeCommandInfo;
export type PresenceGlobalCommandInfo = PresenceCommandInfo | ZigbeeCommandInfo;
