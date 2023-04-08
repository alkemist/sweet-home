import { ZigbeeCommandInfo } from '../zigbee-component.directive';

export type OnOffCommandInfo = 'state';
export type OnOffCommandAction = 'on' | 'off' | 'toggle'
export type OnOffParamValue = 'security' | 'icon';

export type OnOffExtendCommandInfo = OnOffCommandInfo & ZigbeeCommandInfo;
export type OnOffGlobalCommandInfo = OnOffCommandInfo | ZigbeeCommandInfo;
