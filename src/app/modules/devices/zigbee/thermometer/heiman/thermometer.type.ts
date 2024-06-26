import { ThermometerCommandInfo, ThermometerGlobalCommandInfo } from '@devices';

export type ThermometerHeimanCommandInfo = 'co2'

export type ThermometerHeimanExtendCommandInfo = ThermometerHeimanCommandInfo & ThermometerCommandInfo;
export type ThermometerHeimanGlobalCommandInfo = ThermometerHeimanCommandInfo | ThermometerGlobalCommandInfo;

export type ThermometerHeimanParamValue = 'co2';
