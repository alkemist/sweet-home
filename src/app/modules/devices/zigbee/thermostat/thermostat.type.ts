import { ZigbeeBatteryExtendCommandInfo, ZigbeeBatteryGlobalCommandInfo } from '../zigbee-battery-component.directive';

export type ThermostatCommandInfo = 'room' | 'thermostat';
export type ThermostatCommandAction = 'thermostat';

export type ThermostatExtendCommandInfo = ThermostatCommandInfo & ZigbeeBatteryExtendCommandInfo;
export type ThermostatGlobalCommandInfo = ThermostatCommandInfo | ZigbeeBatteryGlobalCommandInfo;
