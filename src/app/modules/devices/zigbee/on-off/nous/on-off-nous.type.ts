import { OnOffCommandAction, OnOffCommandInfo } from '@devices';
import { ZigbeeCommandInfo } from '../../zigbee-component.directive';

export type OnOffNousCommandInfo = 'indicator';
export type OnOffNousCommandAction = 'indicator'

export type OnOffNousExtendCommandInfo = OnOffNousCommandInfo & OnOffCommandInfo & ZigbeeCommandInfo;
export type OnOffNousGlobalCommandInfo = OnOffNousCommandInfo | OnOffCommandInfo | ZigbeeCommandInfo;

export type OnOffNousExtendCommandAction = OnOffNousCommandAction & OnOffCommandAction;
export type OnOffNousGlobalCommandAction = OnOffNousCommandAction | OnOffCommandAction;
