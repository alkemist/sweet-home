import { ZigbeeCommandInfo } from './zigbee-component.directive';

export type ZigbeeBatteryCommandInfo = "battery";

export type ZigbeeBatteryExtendCommandInfo = ZigbeeBatteryCommandInfo & ZigbeeCommandInfo;
export type ZigbeeBatteryGlobalCommandInfo = ZigbeeBatteryCommandInfo | ZigbeeCommandInfo;
