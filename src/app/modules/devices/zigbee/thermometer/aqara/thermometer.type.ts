import { ThermometerCommandInfo, ThermometerGlobalCommandInfo } from '@devices';

export type ThermometerAqaraCommandInfo = 'pression'

export type ThermometerAqaraExtendCommandInfo = ThermometerAqaraCommandInfo & ThermometerCommandInfo;
export type ThermometerAqaraGlobalCommandInfo = ThermometerAqaraCommandInfo | ThermometerGlobalCommandInfo;

export type ThermometerAqaraParamValue = 'pression';
