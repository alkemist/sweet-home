import { ZigbeeBatteryExtendCommandInfo, ZigbeeBatteryGlobalCommandInfo } from '../zigbee.type';

export type ThermostatCommandInfo = 'room' | 'thermostat' | 'battery_low';
export type ThermostatCommandAction = 'thermostat';

export type ThermostatExtendCommandInfo = ThermostatCommandInfo & ZigbeeBatteryExtendCommandInfo;
export type ThermostatGlobalCommandInfo = ThermostatCommandInfo | ZigbeeBatteryGlobalCommandInfo;
